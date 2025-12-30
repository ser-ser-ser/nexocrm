import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import {
    Building2,
    Users,
    DollarSign,
    TrendingUp,
    Activity,
    Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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
        return <div className="p-8">Please log in.</div>
    }

    // 2. Get Profile & Agency Context
    const { data: profile } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const role = profile?.rol || 'agente' // 'rol' instead of 'role', default to 'agente'
    const agencyId = profile?.id_agencia // 'id_agencia' instead of 'agency_id'

    // 3. Fetch Properties based on Role
    let propertiesQuery = supabase
        .from('propiedades')
        .select('*')
        .order('creado_en', { ascending: false }) // 'creado_en' instead of 'created_at'

    if (role === 'admin_agencia' && agencyId) { // 'admin_agencia' instead of 'agency_admin'
        // Admin: Fetch all properties from users in the same agency
        // First, get list of agents in agency
        const { data: agencyMembers } = await supabase
            .from('perfiles')
            .select('id')
            .eq('id_agencia', agencyId)

        if (agencyMembers && agencyMembers.length > 0) {
            const memberIds = agencyMembers.map(m => m.id)
            propertiesQuery = propertiesQuery.in('propietario_id', memberIds) // 'propietario_id' instead of 'owner_id'
        } else {
            // Fallback to own properties if no members found (weird case)
            propertiesQuery = propertiesQuery.eq('propietario_id', user.id)
        }
    } else {
        // Agent / Independent: Own properties only
        propertiesQuery = propertiesQuery.eq('propietario_id', user.id)
    }

    const { data: properties } = await propertiesQuery
    const propertiesList = properties || []

    // 4. Calculate Stats
    const totalProperties = propertiesList.length

    // Simple sum assuming mostly MXN for MVP. In prod, convert currencies.
    const totalValue = propertiesList.reduce((acc, curr) => acc + (Number(curr.precio) || 0), 0)

    const activeLeads = propertiesList.reduce((acc, curr) => {
        // Mock logic: randomly assume some properties have leads based on ID parity or just mock static
        // Better: count unique acquisition_data if not null?
        // Let's just mock a "Lead Count" based on property count * 3 for demo
        return acc + 3
    }, 0)

    const propertiesByCategory = {
        Industrial: propertiesList.filter(p => p.tipo === 'industrial').length,
        Comercial: propertiesList.filter(p => p.tipo === 'comercial').length,
        Residencial: propertiesList.filter(p => p.tipo === 'residencial').length,
    }

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-text-main flex items-center gap-2">
                        Hola, {profile?.nombre_completo?.split(' ')[0] || 'Agente'} 👋
                    </h1>
                    <p className="text-text-muted mt-1 font-medium">
                        {role === 'admin_agencia' ? 'Vista Global de Agencia' : 'Tu Resumen de Actividad'}
                    </p>
                </div>
                <Link href="/dashboard/new">
                    <Button className="rounded-full h-12 px-6 bg-primary font-bold text-white shadow-[8px_8px_16px_rgba(233,122,12,0.3),-8px_-8px_16px_rgba(255,255,255,0.8)] hover:scale-105 transition-transform">
                        <Plus className="mr-2 h-5 w-5" /> Nueva Propiedad
                    </Button>
                </Link>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: Total Inventory */}
                <div className="clay-card p-6 bg-[#fcfaf8] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Building2 className="w-24 h-24 text-primary" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-text-muted text-sm uppercase tracking-wider">Inventario</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-text-main">{totalProperties}</span>
                        <span className="text-sm font-medium text-text-muted">Props</span>
                    </div>
                    <div className="mt-4 flex gap-2 text-xs font-semibold text-text-muted">
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">{propertiesByCategory.Industrial} Ind</span>
                        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">{propertiesByCategory.Comercial} Com</span>
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">{propertiesByCategory.Residencial} Res</span>
                    </div>
                </div>

                {/* Card 2: Total Value */}
                <div className="clay-card p-6 bg-[#fcfaf8] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-24 h-24 text-green-600" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-text-muted text-sm uppercase tracking-wider">Valor Bolsa</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-text-main">{formatCurrency(totalValue)}</span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +12% vs mes anterior
                    </p>
                </div>

                {/* Card 3: Active Leads (Mocked) */}
                <div className="clay-card p-6 bg-[#fcfaf8] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-secondary" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-sm">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-text-muted text-sm uppercase tracking-wider">Leads Activos</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-text-main">{activeLeads}</span>
                        <span className="text-sm font-medium text-text-muted">Interesados</span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-text-muted">
                        Promedio por propiedad: 3.0
                    </p>
                </div>
            </div>

            {/* Recent Activity List */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" /> Recientes
                </h2>

                <div className="clay-card bg-white/50 backdrop-blur-sm p-2">
                    {propertiesList.length === 0 ? (
                        <div className="p-8 text-center text-text-muted">No hay propiedades registradas aún.</div>
                    ) : (
                        <div className="space-y-2">
                            {propertiesList.slice(0, 5).map((prop) => (
                                <div key={prop.id} className="p-4 rounded-2xl bg-white/60 hover:bg-white shadow-sm flex items-center justify-between transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md
                                        ${prop.tipo === 'industrial' ? 'bg-blue-500' :
                                                prop.tipo === 'comercial' ? 'bg-purple-500' : 'bg-green-500'}
                                    `}>
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">{prop.titulo}</h3>
                                            <p className="text-sm text-text-muted flex gap-2">
                                                <span>{prop.direccion}</span>
                                                <span className="text-primary font-semibold">• {formatCurrency(prop.precio || 0)}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                        ${prop.tipo === 'industrial' ? 'bg-blue-100 text-blue-700' :
                                                prop.tipo === 'comercial' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}
                                     `}>
                                            {prop.tipo}
                                        </span>
                                        <Button variant="ghost" size="sm" className="hidden sm:flex text-text-muted hover:text-primary">
                                            Ver
                                        </Button>
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
