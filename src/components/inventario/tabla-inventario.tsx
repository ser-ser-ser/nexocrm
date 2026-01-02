"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database } from "@/types/database.types"
import { cn, formatCurrency } from "@/lib/utils"
import {
    Factory, Store, Home, Building2, MapPin,
    Truck, ArrowUpFromLine, Zap, Users,
    BedDouble, Trees, SearchX
} from "lucide-react"

type Propiedad = Database["public"]["Tables"]["propiedades"]["Row"] & {
    perfiles: { nombre_completo: string | null } | null
    desarrollos: { nombre: string | null } | null
}

interface TablaInventarioProps {
    data: Propiedad[]
}

import { useRouter } from "next/navigation"

export function TablaInventario({ data }: TablaInventarioProps) {
    const router = useRouter()

    // ... (imports remain same)

    const getBadgeColor = (tipo: string | null) => {
        switch (tipo) {
            case "industrial": return "bg-blue-50 text-blue-700 ring-1 ring-blue-700/10 shadow-sm"
            case "comercial": return "bg-orange-50 text-orange-700 ring-1 ring-orange-700/10 shadow-sm"
            case "residencial": return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-700/10 shadow-sm"
            case "desarrollo": return "bg-purple-50 text-purple-700 ring-1 ring-purple-700/10 shadow-sm"
            default: return "bg-slate-50 text-slate-700 ring-1 ring-slate-700/10"
        }
    }

    // ... (currency helper remains same)

    // Polymorphic Technical Sheet
    const renderPolymorphicDetails = (propiedad: Propiedad) => {
        const features = propiedad.caracteristicas as any
        if (!features) return <span className="text-slate-400 text-xs">-</span>

        switch (propiedad.tipo) {
            case "industrial":
                return (
                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                        <div className="flex items-center gap-4">
                            {features.altura_libre && (
                                <div className="flex items-center gap-1.5" title="Altura Libre">
                                    <ArrowUpFromLine className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                    <span className="font-medium">{features.altura_libre}m</span>
                                </div>
                            )}
                            {features.andenes && (
                                <div className="flex items-center gap-1.5" title="Andenes Totales">
                                    <Truck className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                    <span className="font-medium">
                                        {(Number(features.andenes.secos) || 0) + (Number(features.andenes.con_rampa) || 0)} Andenes
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {features.kvas && (
                                <div className="flex items-center gap-1.5" title="KVAs">
                                    <Zap className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
                                    <span className="font-medium">{features.kvas} kVA</span>
                                </div>
                            )}
                            {features.superficie_total && (
                                <div className="flex items-center gap-1.5" title="Superficie Total">
                                    <Factory className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                    <span className="font-medium">{features.superficie_total} m²</span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            case "comercial":
                return (
                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                        {features.superficie_total && (
                            <div className="flex items-center gap-1.5" title="Superficie Total">
                                <Store className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                <span className="font-medium">{features.superficie_total} m²</span>
                            </div>
                        )}
                        {features.flujo_peatonal && (
                            <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                <span>{features.flujo_peatonal} flujo/día</span>
                            </div>
                        )}
                        {features.anclas_cercanas && features.anclas_cercanas.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 truncate max-w-[140px]">
                                    {features.anclas_cercanas[0]}
                                </span>
                            </div>
                        )}
                    </div>
                )
            case "residencial":
                return (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                        {features.recamaras && (
                            <div className="flex items-center gap-1.5">
                                <BedDouble className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                <span className="font-medium">{features.recamaras} Rec.</span>
                            </div>
                        )}
                        {features.superficie_total && (
                            <div className="flex items-center gap-1.5" title="Terreno">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                <span className="font-medium">{features.superficie_total} m²</span>
                            </div>
                        )}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[8px_8px_24px_0_rgba(148,163,184,0.15)] overflow-hidden">
            <Table>
                <TableHeader className="bg-white/50 border-b border-indigo-50/50">
                    <TableRow className="hover:bg-transparent border-transparent">
                        <TableHead className="w-[380px] font-semibold text-slate-700 pl-6 h-12">Propiedad</TableHead>
                        <TableHead className="font-semibold text-slate-700 h-12">Detalles Internos</TableHead>
                        <TableHead className="font-semibold text-slate-700 h-12">Estado & Broker</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right h-12 pr-6">Precio & Moneda</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-48 text-center text-slate-400">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center">
                                        <SearchX className="h-8 w-8 opacity-20" strokeWidth={1.5} />
                                    </div>
                                    <p className="font-medium text-slate-500">No se encontraron propiedades</p>
                                    <p className="text-xs">Intenta ajustar los filtros de búsqueda</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((propiedad) => (
                            <TableRow
                                key={propiedad.id}
                                className="group hover:bg-indigo-50/30 cursor-pointer transition-all border-b border-indigo-50/30 last:border-0"
                                onClick={() => router.push(`/dashboard/inventario/${propiedad.id}`)}
                            >
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-start gap-4">
                                        {/* Icon Box with Claymorphism */}
                                        <div className={cn(
                                            "min-w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105",
                                            propiedad.tipo === "industrial" && "bg-blue-100 text-blue-600 ring-4 ring-blue-50",
                                            propiedad.tipo === "comercial" && "bg-orange-100 text-orange-600 ring-4 ring-orange-50",
                                            propiedad.tipo === "residencial" && "bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50",
                                            !["industrial", "comercial", "residencial"].includes(propiedad.tipo || "") && "bg-slate-100 text-slate-600 ring-4 ring-slate-50"
                                        )}>
                                            {propiedad.tipo === "industrial" && <Factory className="w-6 h-6" strokeWidth={1.5} />}
                                            {propiedad.tipo === "comercial" && <Store className="w-6 h-6" strokeWidth={1.5} />}
                                            {propiedad.tipo === "residencial" && <Home className="w-6 h-6" strokeWidth={1.5} />}
                                            {!["industrial", "comercial", "residencial"].includes(propiedad.tipo || "") && <Building2 className="w-6 h-6" strokeWidth={1.5} />}
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-slate-800 group-hover:text-primary transition-colors text-base leading-tight">
                                                {propiedad.titulo || "Sin Título"}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                <MapPin className="w-3 h-3 text-slate-400" strokeWidth={2} />
                                                <span className="truncate max-w-[220px]">
                                                    {propiedad.direccion || propiedad.ciudad || (propiedad.caracteristicas as any)?.direccion || "Ubicación no especificada"}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 h-5 border-0 font-semibold capitalize tracking-wide rounded-md", getBadgeColor(propiedad.tipo))}>
                                                    {propiedad.tipo}
                                                </Badge>
                                                <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 bg-slate-100 text-slate-600 border-0 font-medium capitalize tracking-wide rounded-md">
                                                    {propiedad.operacion}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="py-4">
                                    {renderPolymorphicDetails(propiedad)}
                                </TableCell>

                                <TableCell className="py-4">
                                    <div className="flex flex-col gap-2">
                                        <div className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border w-fit shadow-sm",
                                            propiedad.estado === "publicada" ? "bg-green-50 text-green-700 border-green-200" :
                                                propiedad.estado === "vendida" ? "bg-slate-100 text-slate-600 border-slate-200" :
                                                    "bg-yellow-50 text-yellow-700 border-yellow-200"
                                        )}>
                                            <span className={cn(
                                                "w-1.5 h-1.5 rounded-full mr-1.5",
                                                propiedad.estado === "publicada" ? "bg-green-500" :
                                                    propiedad.estado === "vendida" ? "bg-slate-500" : "bg-yellow-500"
                                            )} />
                                            <span className="capitalize">{propiedad.estado || "borrador"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold border border-indigo-200">
                                                {propiedad.perfiles?.nombre_completo?.[0] || "?"}
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium truncate max-w-[100px]">
                                                {propiedad.perfiles?.nombre_completo?.split(" ")[0] || "Sistema"}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="text-right pr-6 py-4">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="font-extrabold text-slate-800 text-base tracking-tight">
                                            {formatCurrency(propiedad.precio, propiedad.moneda || 'MXN')}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-1.5 rounded">
                                            {propiedad.moneda || 'MXN'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="w-[50px] py-4">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors">
                                        <ArrowUpFromLine className="h-5 w-5 rotate-45" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
