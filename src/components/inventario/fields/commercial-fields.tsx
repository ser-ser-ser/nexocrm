"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function CommercialFields() {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-sm tracking-wider">
                Especificaciones Comerciales & Retail
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="frente_calle">Frente a Calle (metros)</Label>
                    <Input id="frente_calle" name="frente_calle" type="number" step="0.1" placeholder="Ej. 15.0" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="flujo_vehicular">Flujo Vehicular (aprox. diario)</Label>
                    <Input id="flujo_vehicular" name="flujo_vehicular" type="number" placeholder="Ej. 5000" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="marcas_ancla">Marcas Ancla Cercanas (Separadas por coma)</Label>
                    <Input id="marcas_ancla" name="marcas_ancla" placeholder="Ej. Walmart, Starbucks, BBVA" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="altura_techo">Altura de Techo (m)</Label>
                    <Input id="altura_techo" name="altura_techo" type="number" step="0.1" placeholder="Ej. 4.5" />
                </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="esquina" name="esquina" />
                <Label htmlFor="esquina">Ubicación en Esquina</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="autoservicio" name="autoservicio" />
                <Label htmlFor="autoservicio">Posibilidad de Auto-servicio (Drive-thru)</Label>
            </div>
        </div>
    )
}
