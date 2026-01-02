"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Factory, ShieldCheck } from "lucide-react"

export function IndustrialFields() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">

            {/* Header */}
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-semibold border-b border-slate-100 dark:border-slate-700 pb-2">
                <Factory className="h-5 w-5 text-slate-400" />
                <h2>Especificaciones Industriales</h2>
            </div>

            {/* Technical Details Grid */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Detalles Técnicos & Construcción</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="space-y-2">
                        <Label htmlFor="altura">Altura Libre (m)</Label>
                        <Input id="altura" name="altura" type="number" step="0.1" placeholder="Ej. 9.5 m" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="resistencia_piso_ton_m2">Resistencia Piso (Ton/m²)</Label>
                        <Input id="resistencia_piso_ton_m2" name="resistencia_piso_ton_m2" type="number" step="0.5" placeholder="Ej. 6 Ton/m²" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tipo_techo">Tipo de Techo</Label>
                        <Input id="tipo_techo" name="tipo_techo" placeholder="Ej. KR-18 con Colchoneta" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="iluminacion_natural_pct">% Iluminación Natural</Label>
                        <Input id="iluminacion_natural_pct" name="iluminacion_natural_pct" type="number" placeholder="Ej. 5" />
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700 my-6" />

            {/* Logistics Section */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Logística y Accesos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-2">
                        <Label htmlFor="andenes_carga">Andenes de Carga</Label>
                        <Input id="andenes_carga" name="andenes_carga" type="number" placeholder="Ej. 4" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rampas_nivel_piso">Rampas Nivel Piso</Label>
                        <Input id="rampas_nivel_piso" name="rampas_nivel_piso" type="number" placeholder="Ej. 1" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="patio_maniobras_m">Patio de Maniobras (m²)</Label>
                        <Input id="patio_maniobras_m" name="patio_maniobras_m" type="number" placeholder="Ej. 800" />
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                        <Checkbox id="cross_docking" name="cross_docking" />
                        <Label htmlFor="cross_docking" className="cursor-pointer text-sm">Cross Docking</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                        <Checkbox id="acceso_trailer_53" name="acceso_trailer_53" />
                        <Label htmlFor="acceso_trailer_53" className="cursor-pointer text-sm">Acceso Tráiler 53'</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                        <Checkbox id="espuela_ferrocarril" name="espuela_ferrocarril" />
                        <Label htmlFor="espuela_ferrocarril" className="cursor-pointer text-sm">Espuela Ferrocarril</Label>
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700 my-6" />

            {/* Services */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Servicios e Infraestructura</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="kvas_disponibles">KVAs Disponibles</Label>
                        <Input id="kvas_disponibles" name="kvas_disponibles" type="number" placeholder="Ej. 150" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sistema_contra_incendios">Sistema Contra Incendios</Label>
                        <Select name="sistema_contra_incendios">
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mangueras">Mangueras</SelectItem>
                                <SelectItem value="Sprinklers">Sprinklers / Rociadores</SelectItem>
                                <SelectItem value="Hidrantes">Hidrantes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>


            <div className="h-px bg-slate-100 dark:bg-slate-700 my-6" />

            {/* SUSTENTABILIDAD */}
            <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-sm tracking-wider mb-4">
                    Sustentabilidad y Servicios Adicionales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                        <Checkbox id="certificacion_leed" name="certificacion_leed" />
                        <Label htmlFor="certificacion_leed" className="cursor-pointer text-sm">Certificación LEED</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                        <Checkbox id="paneles_solares" name="paneles_solares" />
                        <Label htmlFor="paneles_solares" className="cursor-pointer text-sm">Paneles Solares / Fotovoltaicos</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                        <Checkbox id="planta_tratamiento_agua" name="planta_tratamiento_agua" />
                        <Label htmlFor="planta_tratamiento_agua" className="cursor-pointer text-sm">Planta de Tratamiento de Agua</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                        <Checkbox id="sistema_captacion_pluvial" name="sistema_captacion_pluvial" />
                        <Label htmlFor="sistema_captacion_pluvial" className="cursor-pointer text-sm">Sistema Captación Pluvial</Label>
                    </div>
                </div>
            </div>

            {/* Infrastructure & Amenities */}


            {/* Legal / Docs */}
            <div className="space-y-2 pt-4">
                <Label htmlFor="documentacion">Documentación y Estatus Legal</Label>
                <textarea
                    id="documentacion"
                    name="documentacion"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Escribe libremente: Escritura en regla, falta terminación de obra, gravamen, permisos, etc."
                />
            </div>
        </div>
    )
}
