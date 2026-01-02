"use client"

import { Database } from "@/types/database.types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, BedDouble, Bath, Car, Store, Warehouse, Share2, Edit, Home, Building2, Factory } from "lucide-react"

type Property = Database['public']['Tables']['propiedades']['Row']

interface DetallePropiedadProps {
    initialData: Property
}

import { formatCurrency } from "@/lib/utils"

export default function DetallePropiedad({ initialData }: DetallePropiedadProps) {


    const getPropertyIcon = (type: string | null) => {
        switch (type) {
            case 'industrial': return <Factory className="h-6 w-6" />
            case 'comercial': return <Store className="h-6 w-6" />
            case 'residencial': return <Home className="h-6 w-6" />
            case 'terreno': return <MapPin className="h-6 w-6" /> // Fallback for land if added
            default: return <Building2 className="h-6 w-6" />
        }
    }

    const getTypeColor = (type: string | null) => {
        switch (type) {
            case 'industrial': return 'bg-slate-600 hover:bg-slate-700'
            case 'comercial': return 'bg-orange-600 hover:bg-orange-700'
            case 'residencial': return 'bg-emerald-600 hover:bg-emerald-700'
            default: return 'bg-primary'
        }
    }

    const renderTechnicalSpecs = (type: string | null, specs: any) => {
        if (!specs) return <p className="text-muted-foreground">Sin especificaciones técnicas.</p>

        switch (type) {
            case 'industrial':
            case 'industrial':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <SpecCard label="Naves Industriales" value={specs.nave_industrial ? "Sí" : "No"} />
                        <SpecCard label="Andenes de Carga" value={specs.andenes} icon={<Warehouse className="h-4 w-4 text-slate-500" />} />
                        <SpecCard label="Rampas de Acceso" value={specs.rampas} />
                        <SpecCard label="Altura Libre" value={specs.altura_libre ? `${specs.altura_libre} m` : null} />

                        <div className="col-span-2 md:col-span-4 h-px bg-slate-100 my-2" />

                        <SpecCard label="KVAs Capacidad" value={specs.kvas} />
                        <SpecCard label="Resistencia Piso" value={specs.resistencia_piso ? `${specs.resistencia_piso} ton/m²` : null} />
                        <SpecCard label="Vía Ferrocarril" value={specs.via_ferrocarril ? "Conectado" : "No"} />
                        <SpecCard label="Patio Maniobras" value={specs.patio_maniobras ? "Sí" : "No"} />

                        <div className="col-span-2 md:col-span-4 h-px bg-slate-100 my-2" />

                        <SpecCard label="Motopuertos" value={specs.motopuertos} />
                        <SpecCard label="Trampas de Grasa" value={specs.trampas_grasa ? "Incluido" : "No"} />
                        <SpecCard label="Anuncio Luminoso" value={specs.anuncio_luminoso ? "Permitido" : "No"} />
                    </div>
                )
            case 'comercial':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <SpecCard label="Flujo Peatonal" value={specs.flujo_peatonal} />
                        <SpecCard label="En Esquina" value={specs.en_esquina ? "Sí" : "No"} />
                        <SpecCard label="Frente" value={specs.frente ? `${specs.frente} m` : null} />
                        <div className="col-span-2 p-3 bg-slate-50 rounded-md border border-slate-100">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Anclas Cercanas</h4>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(specs.anclas_cercanas) && specs.anclas_cercanas.map((ancla: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="bg-white border text-slate-700 font-medium">{ancla}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            case 'residencial':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <SpecCard label="Recámaras" value={specs.recamaras} icon={<BedDouble className="h-4 w-4 text-slate-500" />} />
                        <SpecCard label="Baños" value={specs.banos} icon={<Bath className="h-4 w-4 text-slate-500" />} />
                        <SpecCard label="Estacionamiento" value={specs.estacionamiento} icon={<Car className="h-4 w-4 text-slate-500" />} />
                        <div className="col-span-2 p-3 bg-slate-50 rounded-md border border-slate-100">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Amenidades</h4>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(specs.amenidades) && specs.amenidades.map((item: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="bg-white border text-slate-700 font-medium">{item}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="text-sm text-muted-foreground">
                        <pre className="bg-gray-50 p-2 rounded-md overflow-x-auto text-xs">
                            {JSON.stringify(specs, null, 2)}
                        </pre>
                    </div>
                )
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getTypeColor(initialData.tipo)} text-white`}>
                            {(initialData.tipo || 'OTRO').toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="uppercase tracking-wider">
                            {initialData.operacion || '-'}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
                        {initialData.titulo || 'Propiedad Clasificada'}
                    </h1>
                    <div className="flex items-center text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{initialData.direccion || (initialData.caracteristicas as any)?.direccion || ''}, {initialData.ciudad || ''}, {initialData.estado || ''}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold text-primary">
                        {formatCurrency(initialData.precio, initialData.moneda)}
                    </span>
                    <span className="text-sm text-muted-foreground uppercase">{initialData.moneda || 'MXN'}</span>
                </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex gap-2 border-b pb-4">
                <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir
                </Button>
                <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Propiedad
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Gallery & Description */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Placeholder Gallery */}
                    {/* Gallery Section */}
                    {(() => {
                        const images = (initialData.caracteristicas as any)?.imagenes || [initialData.imagen_principal].filter(Boolean)

                        if (images && images.length > 0) {
                            return (
                                <div className="space-y-4">
                                    {/* Main Image */}
                                    <div className="aspect-video relative rounded-2xl overflow-hidden shadow-sm group">
                                        <img
                                            src={images[0]}
                                            alt={initialData.titulo || 'Propiedad'}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm font-medium">
                                            1 / {images.length}
                                        </div>
                                    </div>
                                    {/* Thumbnails (if more than 1) */}
                                    {images.length > 1 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {images.slice(1, 5).map((img: string, i: number) => (
                                                <div key={i} className="aspect-square rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                                                    <img src={img} alt={`Vista ${i + 2}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        } else {
                            return (
                                <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-sm relative group clay-card flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="mx-auto bg-white p-4 rounded-full shadow-sm mb-2 w-16 h-16 flex items-center justify-center">
                                            {getPropertyIcon(initialData.tipo)}
                                        </div>
                                        <span className="text-sm font-bold text-slate-800 tracking-wide uppercase">Sin Fotos</span>
                                    </div>
                                </div>
                            )
                        }
                    })()}

                    <Card className="border-none shadow-none bg-transparent">
                        <CardHeader className="px-0">
                            <CardTitle>Descripción</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {initialData.descripcion || 'Sin descripción disponible.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Technical Sheet & Map */}
                <div className="space-y-6">
                    {/* Technical Specs Card */}
                    <Card className="overflow-hidden border-t-4 border-t-primary shadow-lg">
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Ficha Técnica
                            </CardTitle>
                            <CardDescription>
                                Detalles específicos de {initialData.tipo || 'la propiedad'}
                            </CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            {renderTechnicalSpecs(initialData.tipo, initialData.caracteristicas)}
                        </CardContent>
                    </Card>

                    {/* Map Placeholder */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Ubicación</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-48 bg-slate-100 w-full flex items-center justify-center">
                                <div className="flex flex-col items-center text-slate-400">
                                    <MapPin className="h-8 w-8 mb-2" />
                                    <span className="text-xs font-semibold">MAPA INTERACTIVO</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 text-xs text-muted-foreground border-t">
                                {initialData.direccion || (initialData.caracteristicas as any)?.direccion || 'Ubicación no disponible'}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function SpecCard({ label, value, icon }: { label: string, value: any, icon?: React.ReactNode }) {
    if (value === null || value === undefined) return null
    return (
        <div className="flex flex-col p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 flex items-center gap-1.5">
                {icon} {label}
            </span>
            <span className="text-sm font-semibold text-slate-900 truncate">
                {value}
            </span>
        </div>
    )
}
