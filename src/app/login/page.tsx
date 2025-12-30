"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff, Home, Mail, Lock, Phone as PhoneIcon, User, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()
    const [mode, setMode] = useState<"login" | "signup">("login")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [specialty, setSpecialty] = useState("Residencial")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push("/dashboard")
                router.refresh()
            } else {
                // Registration Logic
                if (password !== confirmPassword) {
                    throw new Error("Las contraseñas no coinciden")
                }

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            rol: 'agente', // Rol en español
                        }
                    }
                })

                if (authError) throw authError

                if (authData.user) {
                    // Manually insert into profiles if trigger doesn't exist/work
                    // We'll rely on trigger or RLS mostly, but let's try a direct insert for safety if RLS permits
                    // Or assume the user is created and they can update profile later.
                    // For now, let's update profile with phone if possible
                    const { error: profileError } = await supabase
                        .from('perfiles')
                        .update({
                            telefono: phone,
                            nombre_completo: fullName,
                            rol: 'agente'
                        })
                        .eq('id', authData.user.id)

                    // If update fails (e.g. row doesn't exist yet because trigger is slow), we might ignore or retry. 
                    // Better strategy: Just let them in.
                }

                router.push("/dashboard")
                router.refresh()
            }
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Ocurrió un error inesperado")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-body font-sans text-text-main">
            {/* Animated Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-secondary/40 rounded-full blur-3xl opacity-70 animate-float" />
                <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-primary/30 rounded-full blur-3xl opacity-70 animate-float-delayed" />
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl opacity-50 animate-float" />
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-[480px] p-4 sm:p-6 lg:p-8">
                <div className="w-full bg-[#fcfaf8] rounded-[2.5rem] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] p-6 sm:p-10 transition-all duration-500 border border-white/40">

                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white shadow-[8px_8px_16px_rgba(233,122,12,0.4),-8px_-8px_16px_rgba(255,255,255,0.8)]">
                            <Home className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-text-main mb-2">Nexo CRM</h1>
                        <p className="text-text-muted font-medium">Gestiona tus propiedades con una sonrisa.</p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="mb-8 p-1.5 bg-[#f0f0f3] rounded-full shadow-[inset_6px_6px_12px_#d9d9d9,inset_-6px_-6px_12px_#ffffff] flex relative">
                        <button
                            onClick={() => setMode("login")}
                            className={cn(
                                "flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all duration-300",
                                mode === "login"
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-text-muted hover:text-text-main"
                            )}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => setMode("signup")}
                            className={cn(
                                "flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all duration-300",
                                mode === "signup"
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-text-muted hover:text-text-main"
                            )}
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete="off">

                        {mode === "signup" && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold ml-4 text-text-main">Nombre Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                                        <Input
                                            className="w-full h-14 pl-14 pr-6 rounded-full bg-[#f0f0f3] border-none text-text-main shadow-[inset_6px_6px_12px_#d9d9d9,inset_-6px_-6px_12px_#ffffff] focus-visible:ring-primary/50"
                                            placeholder="Tu nombre completo"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold ml-4 text-text-main">Teléfono</label>
                                    <div className="relative">
                                        <PhoneIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                                        <Input
                                            className="w-full h-14 pl-14 pr-6 rounded-full bg-[#f0f0f3] border-none text-text-main shadow-[inset_6px_6px_12px_#d9d9d9,inset_-6px_-6px_12px_#ffffff] focus-visible:ring-primary/50"
                                            placeholder="+52 55 1234 5678"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold ml-4 text-text-main">Especialidad</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                                        <select
                                            className="w-full h-14 pl-14 pr-6 rounded-full bg-[#f0f0f3] border-none text-text-main shadow-[inset_6px_6px_12px_#d9d9d9,inset_-6px_-6px_12px_#ffffff] focus:ring-primary/50 appearance-none font-medium"
                                            value={specialty}
                                            onChange={(e) => setSpecialty(e.target.value)}
                                        >
                                            <option>Residencial</option>
                                            <option>Comercial</option>
                                            <option>Industrial</option>
                                            <option>Mixto</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-bold ml-4 text-text-main">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                                <Input
                                    type="email"
                                    className="w-full h-14 pl-14 pr-6 rounded-full bg-[#f0f0f3] border-none text-text-main shadow-[inset_6px_6px_12px_#d9d9d9,inset_-6px_-6px_12px_#ffffff] focus-visible:ring-primary/50"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-4">
                                <label className="text-sm font-bold text-text-main">Contraseña</label>
                                {mode === "login" && <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">¿Olvidaste tu contraseña?</Link>}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full h-14 pl-14 pr-12 rounded-full bg-[#f0f0f3] border-none text-text-main shadow-[inset_6px_6px_12px_#d9d9d9,inset_-6px_-6px_12px_#ffffff] focus-visible:ring-primary/50"
                                    placeholder={mode === "signup" ? "Mínimo 6 caracteres" : "••••••••"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {mode === "signup" && (
                            <div className="space-y-1">
                                <label className="text-sm font-bold ml-4 text-text-main">Confirmar Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                                    <Input
                                        type="password"
                                        className="w-full h-14 pl-14 pr-6 rounded-full bg-[#f0f0f3] border-none text-text-main shadow-[inset_6px_6px_12px_#d9d9d9,inset_-6px_-6px_12px_#ffffff] focus-visible:ring-primary/50"
                                        placeholder="Repite tu contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100 text-center font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-primary-light text-white font-bold text-lg shadow-[8px_8px_16px_rgba(233,122,12,0.4),-8px_-8px_16px_rgba(255,255,255,0.8)] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (mode === "login" ? "Iniciar Sesión" : "Crear Cuenta")}
                        </Button>
                    </form>

                    <div className="mt-8">
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#e6e0da]"></div>
                            </div>
                            <span className="relative bg-[#fcfaf8] px-4 text-xs font-medium text-text-muted uppercase tracking-wider">O continúa con</span>
                        </div>
                        {/* Social buttons placeholder - keeping simple for now */}
                        <div className="flex justify-center gap-4 opacity-50 pointer-events-none grayscale">
                            <div className="h-12 w-12 rounded-full bg-[#f0f0f3] shadow-[10px_10px_20px_#d1d1d1,-10px_-10px_20px_#ffffff] flex items-center justify-center">G</div>
                            <div className="h-12 w-12 rounded-full bg-[#f0f0f3] shadow-[10px_10px_20px_#d1d1d1,-10px_-10px_20px_#ffffff] flex items-center justify-center">A</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
