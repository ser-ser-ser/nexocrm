"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function IndustrialFields() {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-sm tracking-wider">
                Especificaciones Industriales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="altura_libre">Altura Libre (m)</Label>
                    <Input id="altura_libre" name="altura_libre" type="number" step="0.1" placeholder="Ej. 12.5" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="resistencia_piso">Resistencia de Piso (Ton/m²)</Label>
                    <Input id="resistencia_piso" name="resistencia_piso" type="number" step="0.5" placeholder="Ej. 5.0" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="andenes">Andenes (Docks)</Label>
                    <Input id="andenes" name="andenes" type="number" placeholder="Ej. 4" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="rampas">Rampas de Acceso</Label>
                    <Input id="rampas" name="rampas" type="number" placeholder="Ej. 2" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="kvas">Capacidad Eléctrica (KVAs)</Label>
                    <Input id="kvas" name="kvas" type="number" placeholder="Ej. 150" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="motopuertos">Motopuertos</Label>
                    <Input id="motopuertos" name="motopuertos" type="number" placeholder="Ej. 10" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id="patio_maniobras" name="patio_maniobras" />
                    <Label htmlFor="patio_maniobras">Patio de Maniobras</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="via_ferrocarril" name="via_ferrocarril" />
                    <Label htmlFor="via_ferrocarril">Espuela de Ferrocarril</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="trampas_grasa" name="trampas_grasa" />
                    <Label htmlFor="trampas_grasa">Trampas de Grasa</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="anuncio_luminoso" name="anuncio_luminoso" />
                    <Label htmlFor="anuncio_luminoso">Anuncio Luminoso</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="nave_industrial" name="nave_industrial" defaultChecked />
                    <Label htmlFor="nave_industrial">Nave Industrial</Label>
                </div>
            </div>
        </div>
    )
}
