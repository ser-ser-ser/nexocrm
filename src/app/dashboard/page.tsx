import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import {
    Building2,
    Activity,
    Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommandCenter } from '@/components/dashboard/command-center'

// Helper to format currency
const formatCurrency = (amount: number, currency = 'MXN') => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount)
}

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
            },
        }
    )

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // Redirection handled by middleware usually, but safe fallback
        return <div className="p-8">Sesión no iniciada.</div>
    }

    // 2. Get Profile & Agency Context
    const { data: profile } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const role = profile?.rol || 'agente'
    const agencyId = profile?.id_agencia

    // 3. Fetch Properties (All for stats, Limit 5 for recent)
    let propertiesQuery = supabase
        .from('propiedades')
        .select('id, titulo, precio, tipo, direccion, creado_en')
        .eq('estado', 'publicada') // Only count published properties for value
        .order('creado_en', { ascending: false })

    if (role === 'admin_agencia' && agencyId) {
        const { data: agencyMembers } = await supabase.from('perfiles').select('id').eq('id_agencia', agencyId)
        if (agencyMembers?.length) {
            propertiesQuery = propertiesQuery.in('propietario_id', agencyMembers.map(m => m.id))
        } else {
            propertiesQuery = propertiesQuery.eq('propietario_id', user.id)
        }
    } else {
        propertiesQuery = propertiesQuery.eq('propietario_id', user.id)
    }

    const { data: allProperties } = await propertiesQuery
    const properties = allProperties || []

    // 4. Calculate Metrics
    const totalInventoryValue = properties.reduce((sum, prop) => sum + (prop.precio || 0), 0)
    const estimatedCommission = totalInventoryValue * 0.05

    // Distribution
    const industrialCount = properties.filter(p => p.tipo === 'industrial').length
    const commercialCount = properties.filter(p => p.tipo === 'comercial').length
    const residentialCount = properties.filter(p => !['industrial', 'comercial'].includes(p.tipo)).length // Catch-all or land

    const metrics = {
        financial: {
            totalInventoryValue,
            estimatedCommission
        },
        inventory: {
            total: properties.length,
            distribution: [
                { name: 'Industrial', value: industrialCount, fill: '#475569' }, // Slate-600
                { name: 'Comercial', value: commercialCount, fill: '#4f46e5' }, // Indigo-600
                { name: 'Residencial / Otros', value: residentialCount, fill: '#059669' }, // Emerald-600
            ].filter(item => item.value > 0)
        }
    }

    // Recent properties (last 5)
    const recentProperties = properties.slice(0, 5)

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                        Hola, {profile?.nombre_completo?.split(' ')[0] || 'Agente'}
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">
                        {role === 'admin_agencia' ? 'Vista Global de Agencia' : 'Tu Resumen de Actividad'}
                    </p>
                </div>
                <Link href="/dashboard/new">
                    <Button className="rounded-full h-12 px-6 bg-primary font-bold text-white shadow-lg hover:scale-105 transition-transform">
                        <Plus className="mr-2 h-5 w-5" /> Nueva Propiedad
                    </Button>
                </Link>
            </div>

            {/* COMMAND CENTER (Financial & Inventory Stats) */}
            <CommandCenter metrics={metrics} />

            {/* Recent Activity List (Real Data) */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" /> Actividad Reciente (Real)
                </h2>

                <div className="bg-slate-50/50 rounded-xl p-2 border border-slate-100">
                    {recentProperties.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No hay propiedades registradas aún.</div>
                    ) : (
                        <div className="space-y-2">
                            {recentProperties.map((prop) => (
                                <div key={prop.id} className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm
                                        ${prop.tipo === 'industrial' ? 'bg-slate-600' :
                                                prop.tipo === 'comercial' ? 'bg-indigo-600' : 'bg-emerald-600'}
                                    `}>
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors text-sm md:text-base">
                                                {prop.titulo}
                                            </h3>
                                            <p className="text-xs text-muted-foreground flex gap-2">
                                                <span className="truncate max-w-[150px] md:max-w-xs">{prop.direccion}</span>
                                                <span className="text-primary font-semibold hidden md:inline">• {formatCurrency(prop.precio || 0)}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block
                                        ${prop.tipo === 'industrial' ? 'bg-slate-100 text-slate-600' :
                                                prop.tipo === 'comercial' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}
                                     `}>
                                            {prop.tipo}
                                        </span>
                                        <Link href={`/dashboard/inventario/${prop.id}`}>
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary">
                                                Ver
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
