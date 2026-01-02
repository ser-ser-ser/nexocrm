"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, Building, Wind, Key, ArrowUpFromLine } from "lucide-react"

interface CommercialFieldsProps {
    subtipo: string;
}

export function CommercialFields({ subtipo }: CommercialFieldsProps) {
    // Determine if it's Office (Corporate) or Retail (Local)
    // We treat 'oficina' as corporate, everything else as retail/local for now unless specified
    const isOffice = subtipo === 'oficina' || subtipo === 'corporativo';
    const isLocal = !isOffice; // Default to Local fields for 'local', 'comercial', etc.

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-semibold border-b border-slate-100 dark:border-slate-700 pb-2">
                {isOffice ? <Building className="h-5 w-5 text-indigo-500" /> : <Store className="h-5 w-5 text-orange-500" />}
                <h2>{isOffice ? "Especificaciones Corporativas (Oficinas)" : "Especificaciones Comerciales (Local/Retail)"}</h2>
            </div>

            {/* --- RETAIL FIELDS --- */}
            {isLocal && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="frente_metros">Frente (metros)</Label>
                            <Input id="frente_metros" name="frente_metros" type="number" placeholder="Ej. 15 m" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="altura_libre">Altura Libre (metros)</Label>
                            <Input id="altura_libre" name="altura_libre" type="number" placeholder="Ej. 4.5 m" step="0.1" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="guante_traspaso_mxn" className="flex items-center gap-1">
                                <Key className="h-3 w-3" /> Guante / Traspaso
                            </Label>
                            <Input id="guante_traspaso_mxn" name="guante_traspaso_mxn" type="number" placeholder="Ej. 500000" />
                            <p className="text-[10px] text-muted-foreground">Opcional (MXN)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="giros_permitidos">Giros Permitidos</Label>
                            <Input id="giros_permitidos" name="giros_permitidos" placeholder="Ej. Restaurante, Cafetería, Banco" />
                            <p className="text-[10px] text-muted-foreground">Separados por comas</p>
                        </div>
                    </div>

                    {/* Retail Booleans */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                            <Checkbox id="a_pie_de_calle" name="a_pie_de_calle" />
                            <Label htmlFor="a_pie_de_calle" className="cursor-pointer text-sm">A Pie de Calle</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                            <Checkbox id="en_esquina" name="en_esquina" />
                            <Label htmlFor="en_esquina" className="cursor-pointer text-sm">En Esquina</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                            <Checkbox id="tiene_terraza" name="tiene_terraza" />
                            <Label htmlFor="tiene_terraza" className="cursor-pointer text-sm">Con Terraza</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                            <Checkbox id="acometida_gas" name="acometida_gas" />
                            <Label htmlFor="acometida_gas" className="cursor-pointer text-sm">Acometida de Gas</Label>
                        </div>
                    </div>
                </div>
            )}


            {/* --- OFFICE FIELDS --- */}
            {isOffice && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="tipo_entrega">Tipo de Entrega</Label>
                            <Select name="tipo_entrega">
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="obra_gris">Obra Gris (Shell)</SelectItem>
                                    <SelectItem value="acondicionada">Acondicionada</SelectItem>
                                    <SelectItem value="amueblada">Amueblada (Plug & Play)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sistema_aire_acondicionado" className="flex items-center gap-1">
                                <Wind className="h-3 w-3" /> Aire Acondicionado
                            </Label>
                            <Select name="sistema_aire_acondicionado">
                                <SelectTrigger>
                                    <SelectValue placeholder="Sistema HVAC" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="puntas_agua_helada">Puntas de Agua Helada</SelectItem>
                                    <SelectItem value="vrf">Sistema VRF</SelectItem>
                                    <SelectItem value="minisplit">Minisplits</SelectItem>
                                    <SelectItem value="ninguno">Ninguno / Natural</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ratio_estacionamiento">Ratio Estacionamiento</Label>
                            <Input id="ratio_estacionamiento" name="ratio_estacionamiento" placeholder="Ej. 1:30 (1 cajón cada 30m²)" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="elevadores_cantidad" className="flex items-center gap-1">
                                <ArrowUpFromLine className="h-3 w-3" /> Elevadores
                            </Label>
                            <Input id="elevadores_cantidad" name="elevadores_cantidad" type="number" placeholder="Ej. 4" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                            <Checkbox id="certificacion_leed" name="certificacion_leed" />
                            <Label htmlFor="certificacion_leed" className="cursor-pointer">Certificación LEED</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white dark:bg-slate-800">
                            <Checkbox id="control_acceso" name="control_acceso" />
                            <Label htmlFor="control_acceso" className="cursor-pointer">Control de Acceso / Torniquetes</Label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
