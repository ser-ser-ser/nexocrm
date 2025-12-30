"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function ResidentialFields() {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-sm tracking-wider">
                Especificaciones Residenciales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="recamaras">Recámaras</Label>
                    <Input id="recamaras" name="recamaras" type="number" placeholder="Ej. 3" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="banos">Baños Completos</Label>
                    <Input id="banos" name="banos" type="number" step="0.5" placeholder="Ej. 2.5" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="estacionamientos">Estacionamientos</Label>
                    <Input id="estacionamientos" name="estacionamientos" type="number" placeholder="Ej. 2" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="amenidades">Amenidades (Separadas por coma)</Label>
                <Input id="amenidades" name="amenidades" placeholder="Ej. Alberca, Gym, Salón de Eventos" />
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="pet_friendly" name="pet_friendly" />
                <Label htmlFor="pet_friendly">Pet Friendly</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="amueblado" name="amueblado" />
                <Label htmlFor="amueblado">Amueblado</Label>
            </div>
        </div>
    )
}
