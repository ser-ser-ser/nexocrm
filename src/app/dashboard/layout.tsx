import { Sidebar, MobileSidebar } from "@/components/dashboard/sidebar"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "@/types/database.types"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    // 1. Get User
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // 2. Get Profile (Cerebro Centralizado)
    const { data: profile } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", user.id)
        .single()

    const userProfile = {
        full_name: profile?.nombre_completo || user.email?.split('@')[0] || "Usuario",
        role: profile?.rol || "agente", // default fallback
        email: user.email
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar - Now floating */}
            <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
                <Sidebar userProfile={userProfile} />
            </div>

            {/* Main Content Area */}
            <div className="md:pl-72 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden flex h-14 items-center gap-4 border-b bg-background px-6">
                    {/* Pass userProfile to MobileSidebar if needed, for now just keeping structure */}
                    <MobileSidebar />
                    <span className="font-semibold text-lg">NexoCRM</span>
                </header>

                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
