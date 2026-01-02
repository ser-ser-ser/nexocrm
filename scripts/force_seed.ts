import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function main() {
    const email = 'laura@grupomaster.com'
    const password = 'password123'

    console.log(`🔍 Checking user ${email}...`)

    // List users to find if exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('Error listing users:', listError)
        process.exit(1)
    }

    const user = users.find(u => u.email === email)

    let userId: string

    if (user) {
        console.log('✅ User found. Resetting password...')
        userId = user.id
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            {
                password: password,
                email_confirm: true,
                user_metadata: { full_name: 'Laura Dueña' }
            }
        )
        if (updateError) {
            console.error('❌ Error updating user:', updateError)
            process.exit(1)
        }
        console.log('✅ Password reset to:', password)
    } else {
        console.log('⚠️ User not found. Creating fresh...')
        const { data, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: 'Laura Dueña' }
        })
        if (createError) {
            console.error('❌ Error creating user:', createError)
            process.exit(1)
        }
        userId = data.user.id
        console.log('✅ User created successfully.')
    }

    console.log('🔄 Syncing Profile (perfiles table)...')
    const { error: profileError } = await supabase
        .from('perfiles')
        .upsert({
            id: userId,
            email: email,
            nombre_completo: 'Laura Dueña',
            rol: 'admin_agencia',
            creado_en: new Date().toISOString()
        })

    if (profileError) {
        console.error('❌ Error upserting profile:', profileError.message)
    } else {
        console.log('✅ Profile synced.')
    }

    console.log('\n🎉 DONE. You can login now.')
}

main().catch(e => console.error(e))
