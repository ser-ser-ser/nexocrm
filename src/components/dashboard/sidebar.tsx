"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Building2,
    PlusCircle,
    Users,
    LogOut,
    Menu
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const sidebarItems = [
    {
        title: "Tablero",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Inventario",
        href: "/dashboard/inventario",
        icon: Building2,
    },
    {
        title: "Nueva Propiedad",
        href: "/dashboard/new",
        icon: PlusCircle,
    },
    {
        title: "Clientes",
        href: "/dashboard/clients",
        icon: Users,
    },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userProfile?: {
        full_name: string | null
        role: string | null,
        email?: string
    }
}

export function Sidebar({ className, userProfile }: SidebarProps) {
    const pathname = usePathname()
    const supabase = createClient()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function handleLogout() {
        setIsLoading(true)
        try {
            await supabase.auth.signOut()
            router.push("/login")
            router.refresh()
        } catch (error) {
            console.error("Error logging out:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("pb-12 h-full clay-card m-4 flex flex-col", className)}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <h2 className="mb-6 px-4 text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        NexoCRM
                    </h2>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start mb-1 font-medium",
                                    pathname === item.href
                                        ? "bg-secondary text-white hover:bg-secondary/80 shadow-md"
                                        : "text-text-main hover:text-primary hover:bg-primary/10"
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-3 h-5 w-5" strokeWidth={1.5} />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="mt-auto px-4 pb-4">
                <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {userProfile?.full_name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate dark:text-slate-100">
                                {userProfile?.full_name || "Usuario"}
                            </p>
                            <p className="text-xs text-slate-500 truncate dark:text-slate-400 capitalize">
                                {userProfile?.role || "Agente"}
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={handleLogout}
                    disabled={isLoading}
                >
                    <LogOut className="mr-3 h-5 w-5" strokeWidth={1.5} />
                    {isLoading ? "Cerrando..." : "Cerrar Sesión"}
                </Button>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <Sidebar className="border-none" />
            </SheetContent>
        </Sheet>
    )
}
