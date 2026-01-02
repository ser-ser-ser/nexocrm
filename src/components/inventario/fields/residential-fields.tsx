"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Home, Bath, Car, Layers, Zap, Shield, TreeDeciduous, Wind } from "lucide-react"

const AMENIDADES_LIST = [
    { id: "alberca", label: "Alberca" },
    { id: "gimnasio", label: "Gimnasio" },
    { id: "roof_garden", label: "Roof Garden" },
    { id: "salon_usos_multiples", label: "Salón de Usos Múltiples" },
    { id: "asadores", label: "Zona de Asadores" },
    { id: "juegos_infantiles", label: "Juegos Infantiles" },
    { id: "cine", label: "Sala de Cine" },
    { id: "biblioteca", label: "Biblioteca / Coworking" }
]

export function ResidentialFields() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-semibold border-b border-slate-100 dark:border-slate-700 pb-2">
                <Home className="h-5 w-5 text-slate-400" />
                <h2>Especificaciones Residenciales</h2>
            </div>

            {/* Basic Residential Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="recamaras" className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-slate-400" /> Recámaras
                    </Label>
                    <Input id="recamaras" name="recamaras" type="number" placeholder="Ej. 3" min="0" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="banos_completos" className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-slate-400" /> Baños Completos
                    </Label>
                    <Input id="banos_completos" name="banos_completos" type="number" placeholder="Ej. 2" min="0" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="medios_banos">Medios Baños</Label>
                    <Input id="medios_banos" name="medios_banos" type="number" placeholder="Ej. 1" min="0" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="estacionamientos" className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-slate-400" /> Estacionamientos
                    </Label>
                    <Input id="estacionamientos" name="estacionamientos" type="number" placeholder="Ej. 2" min="0" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="niveles_plantas">Niveles / Plantas</Label>
                    <Input id="niveles_plantas" name="niveles_plantas" type="number" placeholder="Ej. 2" min="1" />
                </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700 my-4" />

            {/* Services & Rules (The Switches) */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Servicios e Interior</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center justify-between border p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex flex-col">
                            <Label htmlFor="cuarto_servicio" className="cursor-pointer font-medium mb-1">Cuarto de Servicio</Label>
                            <span className="text-xs text-muted-foreground">Con baño completo</span>
                        </div>
                        <Switch id="cuarto_servicio" name="cuarto_servicio" />
                    </div>
                    <div className="flex items-center justify-between border p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex flex-col">
                            <Label htmlFor="cuarto_lavado" className="cursor-pointer font-medium mb-1">Cuarto de Lavado</Label>
                            <span className="text-xs text-muted-foreground">Area dedicada</span>
                        </div>
                        <Switch id="cuarto_lavado" name="cuarto_lavado" />
                    </div>
                    <div className="flex items-center justify-between border p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex flex-col">
                            <Label htmlFor="aire_acondicionado_minisplit" className="cursor-pointer font-medium mb-1 flex items-center gap-1">
                                <Wind className="h-3 w-3" /> Climatización
                            </Label>
                            <span className="text-xs text-muted-foreground">Minisplits o Clima Central</span>
                        </div>
                        <Switch id="aire_acondicionado_minisplit" name="aire_acondicionado_minisplit" />
                    </div>
                    <div className="flex items-center justify-between border p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex flex-col">
                            <Label htmlFor="mascotas_permitidas" className="cursor-pointer font-medium mb-1">Pet Friendly</Label>
                            <span className="text-xs text-muted-foreground">Mascotas permitidas</span>
                        </div>
                        <Switch id="mascotas_permitidas" name="mascotas_permitidas" />
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700 my-4" />

            {/* Exterior & Security */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Exterior y Seguridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center space-x-3 p-2">
                        <Checkbox id="jardin_privado" name="jardin_privado" className="h-5 w-5" />
                        <div className="flex items-center gap-2">
                            <TreeDeciduous className="h-4 w-4 text-green-600" />
                            <Label htmlFor="jardin_privado" className="cursor-pointer text-sm font-medium">Jardín Privado</Label>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2">
                        <Checkbox id="vigilancia_24_7" name="vigilancia_24_7" className="h-5 w-5" />
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <Label htmlFor="vigilancia_24_7" className="cursor-pointer text-sm font-medium">Vigilancia 24/7</Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700 my-4" />

            {/* Amenities Grid */}
            <div>
                <Label className="mb-4 block text-xs font-bold text-slate-400 uppercase tracking-wide">Amenidades Comunes</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {AMENIDADES_LIST.map((amenidad) => (
                        <div key={amenidad.id} className="flex items-center space-x-2 border p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <Checkbox id={`amenidad_${amenidad.id}`} name={`amenidad_${amenidad.id}`} />
                            <Label htmlFor={`amenidad_${amenidad.id}`} className="text-sm cursor-pointer select-none">
                                {amenidad.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
