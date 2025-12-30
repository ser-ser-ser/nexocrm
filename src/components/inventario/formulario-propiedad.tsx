"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// Import polymorphic fields
import { IndustrialFields } from "./fields/industrial-fields"
import { CommercialFields } from "./fields/commercial-fields"
import { ResidentialFields } from "./fields/residential-fields"

export default function FormularioPropiedad() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [categoria, setCategoria] = useState<string>("industrial")

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData)

        // Extract base fields
        // Extract base fields
        const camposBase = {
            titulo: data.title as string,
            descripcion: data.description as string,
            precio: Number(data.price),
            ubicacion: data.address as string, // JSONB or String? Schema says 'ubicacion' is unknown (jsonb?) but 'direccion' is string. Let's use direccion.
            direccion: data.address as string,
            tipo: categoria,
            estado: "disponible",
            // TODO: obtener owner_id real de la sesión
        }

        // Extract features (everything else not in base)
        const { title, description, price, address, operation, ...caracteristicas } = data

        // Basic user retrieval for owner_id
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert("No estás logueado")
            setIsLoading(false)
            return
        }

        try {
            const { error } = await supabase
                .from('propiedades') // Tabla en español
                .insert({
                    ...camposBase,
                    operacion: data.operation as any, // venta/renta
                    propietario_id: user.id,
                    caracteristicas: caracteristicas // JSONB
                })

            if (error) throw error

            router.push('/dashboard/inventario')
            router.refresh()

        } catch (error) {
            console.error('Error creating property:', error)
            alert('Error al crear la propiedad')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <Card className="w-full max-w-4xl mx-auto border-none shadow-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">Nueva Propiedad</CardTitle>
                    <CardDescription>
                        Ingresa los detalles de la nueva oportunidad de inversión.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* 1. Categoría (El switch principal) */}
                    <div className="space-y-2">
                        <Label>Categoría del Activo</Label>
                        <Select
                            value={categoria}
                            onValueChange={(val) => setCategoria(val)}
                        >
                            <SelectTrigger className="w-full md:w-[300px] h-12 text-lg font-medium">
                                <SelectValue placeholder="Selecciona categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="industrial">Industrial</SelectItem>
                                <SelectItem value="comercial">Comercial / Retail</SelectItem>
                                <SelectItem value="residencial">Residencial</SelectItem>
                                <SelectItem value="terreno">Terreno</SelectItem>
                                <SelectItem value="oficina">Oficina</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Base Fields - Column 1 */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título de la Propiedad</Label>
                                <Input id="title" name="title" placeholder="Ej. Nave Industrial AAA en Apodaca" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Precio (MXN)</Label>
                                <Input id="price" name="price" type="number" placeholder="Ej. 15000000" required />
                            </div>
                        </div>

                        {/* Base Fields - Column 2 */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección / Ubicación</Label>
                                <Input id="address" name="address" placeholder="Calle, Número, Colonia, Ciudad" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="operation">Tipo de Operación</Label>
                                <Select name="operation" defaultValue="venta">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="venta">Venta</SelectItem>
                                        <SelectItem value="renta">Renta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción Detallada</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe las características clave..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="h-px bg-border my-8" />

                    {/* 2. Campos Polimórficos */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        {categoria === 'industrial' && <IndustrialFields />}
                        {categoria === 'comercial' && <CommercialFields />}
                        {categoria === 'residencial' && <ResidentialFields />}
                        {/* Fallback for others */}
                        {(categoria === 'terreno' || categoria === 'oficina') && (
                            <p className="text-center text-muted-foreground italic">
                                Configuración específica para {categoria} pendiente de definir.
                                Se guardarán solo datos básicos.
                            </p>
                        )}
                    </div>

                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                    <Button variant="ghost" type="button" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Propiedad
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
