import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { mockUsers, mockProperties } from '@/lib/mockData'

export async function GET(request: Request) {
    // Use SERVICE_ROLE_KEY to bypass RLS and manage Auth users
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    const createdUserIds: Record<number, string> = {}
    const results = { users: 0, properties: 0, errors: [] as string[] }

    try {
        // 1. Seed Users
        for (const user of mockUsers) {
            // Check if user exists
            const { data: existingUser } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', user.email)
                .single()

            let userId = existingUser?.id

            if (!userId) {
                // Create Auth User
                const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
                    email: user.email,
                    password: user.password,
                    email_confirm: true,
                    user_metadata: { full_name: user.profile.full_name }
                })

                if (authError) {
                    // Likely already exists in Auth but not Profile (edge case), or real error
                    // Try signIn to get ID if "User already registered"
                    console.error(`Error creating user ${user.email}:`, authError.message)
                    results.errors.push(`User error ${user.email}: ${authError.message}`)
                    continue
                }
                userId = authUser.user.id
            }

            // Map reference ID to real UUID
            createdUserIds[user.id_ref] = userId

            // Update Profile
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: userId,
                    ...user.profile
                })

            if (profileError) {
                console.error(`Error updating profile ${user.email}:`, profileError.message)
                results.errors.push(`Profile error ${user.email}: ${profileError.message}`)
            } else {
                results.users++
            }
        }

        // 2. Seed Properties
        for (const prop of mockProperties) {
            const ownerId = createdUserIds[prop.owner_ref]

            if (!ownerId) {
                results.errors.push(`Skipping property ${prop.title}: Owner not found`)
                continue
            }

            // Remove owner_ref from object before inserting
            const { owner_ref, ...propData } = prop

            const { error: propError } = await supabaseAdmin
                .from('propiedades')
                .insert({
                    owner_id: ownerId,
                    ...propData
                })

            if (propError) {
                console.error(`Error creating property ${prop.title}:`, propError.message)
                results.errors.push(`Property error ${prop.title}: ${propError.message}`)
            } else {
                results.properties++
            }
        }

        return NextResponse.json({ success: true, results, createdUserIds })

    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}
