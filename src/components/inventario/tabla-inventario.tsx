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
import { cn } from "@/lib/utils"
import {
    Factory, Store, Home, Building2, MapPin,
    Truck, ArrowUpFromLine, Zap, Users,
    BedDouble, Trees, SearchX
} from "lucide-react"

type Propiedad = Database["public"]["Tables"]["propiedades"]["Row"] & {
    perfiles: { nombre_completo: string | null } | null
}

interface TablaInventarioProps {
    data: Propiedad[]
}

import { useRouter } from "next/navigation"

export function TablaInventario({ data }: TablaInventarioProps) {
    const router = useRouter()

    const getBadgeColor = (tipo: string | null) => {
        switch (tipo) {
            case "industrial": return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
            case "comercial": return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200"
            case "residencial": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
            case "desarrollo": return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200"
            default: return "bg-slate-100 text-slate-700 border-slate-200"
        }
    }

    const formatCurrency = (amount: number | null, currency: string | null) => {
        if (!amount) return "-"
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: currency || "MXN",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Polymorphic Technical Sheet
    const renderPolymorphicDetails = (propiedad: Propiedad) => {
        const features = propiedad.caracteristicas as any
        if (!features) return <span className="text-slate-400 text-xs">-</span>

        switch (propiedad.tipo) {
            case "industrial":
                return (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                        {features.andenes && (
                            <div className="flex items-center gap-1.5" title="Andenes">
                                <Truck className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                <span className="font-medium">{features.andenes}</span>
                            </div>
                        )}
                        {features.altura_libre && (
                            <div className="flex items-center gap-1.5" title="Altura Libre">
                                <ArrowUpFromLine className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                <span className="font-medium">{features.altura_libre}m</span>
                            </div>
                        )}
                        {features.kvas && (
                            <div className="flex items-center gap-1.5" title="KVAs">
                                <Zap className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                <span className="font-medium">{features.kvas} kVA</span>
                            </div>
                        )}
                    </div>
                )
            case "comercial":
                return (
                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                        {features.flujo_peatonal && (
                            <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                <span>{features.flujo_peatonal}</span>
                            </div>
                        )}
                        {features.anclas_cercanas && features.anclas_cercanas.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Store className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                <span className="truncate max-w-[120px]">{features.anclas_cercanas[0]}</span>
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
                                <span className="font-medium">{features.recamaras}</span>
                            </div>
                        )}
                        {features.amenidades && features.amenidades.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Trees className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                                <span className="font-medium">{features.amenidades.length} Amenid.</span>
                            </div>
                        )}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="rounded-2xl border border-slate-100 bg-white/50 backdrop-blur-xl shadow-[8px_8px_24px_rgba(0,0,0,0.02)] overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-[350px] font-semibold text-slate-800">Propiedad</TableHead>
                        <TableHead className="font-semibold text-slate-800">Broker</TableHead>
                        <TableHead className="font-semibold text-slate-800">Estado</TableHead>
                        <TableHead className="font-semibold text-slate-800 text-right">Precio</TableHead>
                        <TableHead className="font-semibold text-slate-800">Ficha Técnica</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                                <div className="flex flex-col items-center gap-2">
                                    <SearchX className="h-8 w-8 opacity-50" strokeWidth={1.5} />
                                    <p>No se encontraron propiedades activas.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((propiedad) => (
                            <TableRow
                                key={propiedad.id}
                                className="hover:bg-slate-50/80 cursor-pointer transition-colors border-slate-100 group"
                                onClick={() => router.push(`/dashboard/inventario/${propiedad.id}`)}
                            >
                                <TableCell>
                                    <div className="flex items-start gap-4">
                                        {/* Icon Placeholder based on Type */}
                                        <div className={cn(
                                            "min-w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-slate-600 bg-white border border-slate-100",
                                            propiedad.tipo === "industrial" && "text-blue-600 bg-blue-50/50 border-blue-100",
                                            propiedad.tipo === "comercial" && "text-orange-600 bg-orange-50/50 border-orange-100",
                                            propiedad.tipo === "residencial" && "text-emerald-600 bg-emerald-50/50 border-emerald-100"
                                        )}>
                                            {propiedad.tipo === "industrial" && <Factory className="w-5 h-5" strokeWidth={1.5} />}
                                            {propiedad.tipo === "comercial" && <Store className="w-5 h-5" strokeWidth={1.5} />}
                                            {propiedad.tipo === "residencial" && <Home className="w-5 h-5" strokeWidth={1.5} />}
                                            {!["industrial", "comercial", "residencial"].includes(propiedad.tipo) && <Building2 className="w-5 h-5" strokeWidth={1.5} />}
                                        </div>

                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-slate-800 group-hover:text-primary transition-colors text-sm">
                                                {propiedad.titulo || "Sin Título"}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <MapPin className="w-3 h-3" strokeWidth={1.5} />
                                                <span className="truncate max-w-[200px]">
                                                    {propiedad.direccion || propiedad.ciudad || (propiedad.caracteristicas as any)?.direccion || "Ubicación no especificada"}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 border-0 font-medium", getBadgeColor(propiedad.tipo))}>
                                                    {propiedad.tipo}
                                                </Badge>
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-slate-100 text-slate-600 border-0 font-medium capitalize">
                                                    {propiedad.operacion}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                                            {propiedad.perfiles?.nombre_completo?.[0] || "?"}
                                        </div>
                                        <span className="text-sm text-slate-600 font-medium">
                                            {propiedad.perfiles?.nombre_completo?.split(" ")[0] || "Sistema"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={cn(
                                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                                        propiedad.estado === "publicada" ? "bg-green-50 text-green-700 border-green-200" :
                                            propiedad.estado === "vendida" ? "bg-slate-100 text-slate-600 border-slate-200" :
                                                "bg-yellow-50 text-yellow-700 border-yellow-200" // borrador/pausada
                                    )}>
                                        <span className={cn(
                                            "w-1.5 h-1.5 rounded-full mr-1.5",
                                            propiedad.estado === "publicada" ? "bg-green-500" :
                                                propiedad.estado === "vendida" ? "bg-slate-500" : "bg-yellow-500"
                                        )} />
                                        <span className="capitalize">{propiedad.estado || "borrador"}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-slate-800 text-sm">
                                            {formatCurrency(propiedad.precio, propiedad.moneda || 'MXN')}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                            {propiedad.moneda || 'MXN'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {renderPolymorphicDetails(propiedad)}
                                </TableCell>
                                <TableCell>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5">
                                        <ArrowUpFromLine className="h-4 w-4 rotate-45" />
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
