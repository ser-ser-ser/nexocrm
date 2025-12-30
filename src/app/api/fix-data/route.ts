import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { Database } from "@/types/database.types"

export async function GET(request: Request) {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: any) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: any) {
                    cookieStore.delete({ name, ...options })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Count all properties
    const { count: totalCount, error: countError } = await supabase
        .from("propiedades")
        .select("*", { count: 'exact', head: true })

    if (countError) {
        return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    // 2. Count my properties
    const { count: myCount, error: myCountError } = await supabase
        .from("propiedades")
        .select("*", { count: 'exact', head: true })
        .eq("propietario_id", user.id)

    // 3. Fix logic
    let message = `Total: ${totalCount}, Mios: ${myCount}`
    let updated = 0

    if ((totalCount || 0) > 0 && (myCount || 0) === 0) {
        // Assign all to me
        const { data, error: updateError } = await supabase
            .from("propiedades")
            .update({ propietario_id: user.id } as any)
            .neq("propietario_id", user.id)
            .select()

        if (updateError) {
            message += `. Error updating: ${updateError.message}`
        } else {
            updated = data?.length || 0
            message += `. UPDATED ${updated} properties to user ${user.id}`
        }
    } else {
        message += ". No update needed (you already have properties or none exist)."
    }

    return NextResponse.json({
        success: true,
        message,
        total: totalCount,
        mine: myCount,
        updated
    })
}
