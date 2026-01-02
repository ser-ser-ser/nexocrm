import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { NextResponse } from 'next/server'
import { mockUsers, mockProperties } from '@/lib/mockData'

export async function GET(request: Request) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

    let supabase: SupabaseClient<Database>
    let mode = 'admin'

    if (serviceRoleKey) {
        supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        })
    } else {
        console.warn('⚠️ Missing SUPABASE_SERVICE_ROLE_KEY. Falling back to public sign-up (Anon Key).')
        mode = 'public'
        supabase = createClient<Database>(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
            auth: { autoRefreshToken: false, persistSession: false }
        })
    }

    const createdUserIds: Record<number, string> = {}
    const results = { users: 0, properties: 0, errors: [] as string[], mode }

    try {
        // 1. Seed Users
        for (const user of mockUsers) {
            let userId: string | undefined

            if (mode === 'admin') {
                // ... Admin Logic (Existing) ...
                const { data: existingUser } = await supabase.auth.admin.listUsers()
                const found = existingUser.users.find(u => u.email === user.email)
                userId = found?.id

                if (!userId) {
                    const { data, error } = await supabase.auth.admin.createUser({
                        email: user.email,
                        password: user.password,
                        email_confirm: true,
                        user_metadata: { full_name: user.profile.full_name }
                    })
                    if (error) {
                        results.errors.push(`Admin Create Error (${user.email}): ${error.message}`)
                        continue
                    }
                    userId = data.user.id
                } else {
                    // Update password if exists
                    await supabase.auth.admin.updateUserById(userId, {
                        password: user.password,
                        email_confirm: true,
                        user_metadata: { full_name: user.profile.full_name }
                    })
                }
            } else {
                // ... Public Logic (Fallback) ...
                // Try Sign In first
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: user.password
                })

                if (signInData.user) {
                    userId = signInData.user.id
                } else {
                    // Try Sign Up
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email: user.email,
                        password: user.password,
                        options: { data: { full_name: user.profile.full_name } }
                    })

                    if (signUpError) {
                        results.errors.push(`Public SignUp Error (${user.email}): ${signUpError.message}`)
                        continue
                    }

                    if (signUpData.user && !signUpData.session) {
                        results.errors.push(`User ${user.email} created but REQUIRES EMAIL CONFIRMATION. Check your email or Supabase Inbucket.`)
                        userId = signUpData.user.id
                    } else if (signUpData.user) {
                        userId = signUpData.user.id
                    }
                }
            }

            if (!userId) continue
            createdUserIds[user.id_ref] = userId

            // Upsert Profile (Works if RLS allows specific user or if Admin)
            // Note: If public mode, RLS might block upserting 'rol' or 'id_agencia' depending on policy.
            // We'll try anyway.
            const { error: profileError } = await supabase
                .from('perfiles')
                .upsert({
                    id: userId,
                    nombre_completo: user.profile.full_name,
                    rol: user.profile.role as any, // Might fail RLS if not admin
                    email: user.email,
                    creado_en: new Date().toISOString()
                })

            if (profileError) {
                console.error(`Profile Error ${user.email}:`, profileError.message)
                results.errors.push(`Profile Error (${user.email}): ${profileError.message}`)
            } else {
                results.users++
            }
        }

        // 2. Seed Properties (Needs valid ownerIds)
        if (mode === 'admin') {
            // Admin can insert for anyone
            for (const prop of mockProperties) {
                const ownerId = createdUserIds[prop.owner_ref]
                if (!ownerId) continue

                // ... Property Insertion Logic ...
                const { error: propError } = await supabase
                    .from('propiedades')
                    .insert({
                        propietario_id: ownerId,
                        titulo: prop.title,
                        descripcion: prop.title,
                        precio: prop.price,
                        moneda: prop.currency,
                        tipo: prop.category as any,
                        operacion: prop.operation_type as any,
                        direccion: prop.address,
                        ciudad: null,
                        estado: 'disponible',
                        imagen_principal: prop.images?.[0] || null,
                        caracteristicas: {
                            ...prop.specs,
                            acquisition_data: prop.acquisition_data,
                            imagenes: prop.images
                        }
                    })

                if (propError) results.errors.push(`Prop Error: ${propError.message}`)
                else results.properties++
            }
        } else {
            results.errors.push("Skipping Properties Seed in Public Mode (RLS prevents inserting for others). Manually create properties in UI.")
        }

        return NextResponse.json({ success: true, results, createdUserIds })

    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message, stack: err.stack }, { status: 500 })
    }
}
