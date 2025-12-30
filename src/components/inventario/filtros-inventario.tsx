"use client"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Database } from "@/types/database.types"
import { Search } from "lucide-react"

type TipoPropiedad = Database["public"]["Enums"]["tipo_propiedad"]
type TipoOperacion = Database["public"]["Enums"]["tipo_operacion"]

interface FiltrosInventarioProps {
    onSearchChange: (value: string) => void
    onTypeChange: (value: TipoPropiedad | "todos") => void
    onOperationChange: (value: TipoOperacion | "todos") => void
}

export function FiltrosInventario({
    onSearchChange,
    onTypeChange,
    onOperationChange,
}: FiltrosInventarioProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 bg-background border rounded-lg shadow-sm">
            <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por título o ciudad..."
                    className="pl-8"
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <Select onValueChange={(val) => onTypeChange(val as TipoPropiedad | "todos")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tipo de Propiedad" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="residencial">Residencial</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="oficina">Oficina</SelectItem>
                        <SelectItem value="desarrollo">Desarrollo</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={(val) => onOperationChange(val as TipoOperacion | "todos")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Operación" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todas</SelectItem>
                        <SelectItem value="venta">Venta</SelectItem>
                        <SelectItem value="renta">Renta</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
