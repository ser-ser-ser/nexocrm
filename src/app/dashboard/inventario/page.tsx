import { createClient } from "@/utils/supabase/server"
import { ClienteInventario } from "@/components/inventario/cliente-inventario"

export default async function InventoryPage() {
    const supabase = await createClient()

    const { data: propiedades, error } = await supabase
        .from("propiedades")
        .select("*, perfiles(nombre_completo)")
        .order("creado_en", { ascending: false })

    if (error) {
        console.error("Error fetching properties:", error)
        return <div>Error al cargar el inventario.</div>
    }

    return (
        <div className="container mx-auto py-8">
            <ClienteInventario initialData={propiedades || []} />
        </div>
    )
}
