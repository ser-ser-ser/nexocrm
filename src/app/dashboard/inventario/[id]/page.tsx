import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import DetallePropiedad from "@/components/inventario/detalle-propiedad"

// Generate metadata for SEO using the property title
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const supabase = await createClient()
    const { data: property } = await supabase
        .from('propiedades')
        .select('titulo, descripcion')
        .eq('id', resolvedParams.id)
        .single()

    if (!property) {
        return { title: 'Propiedad no encontrada' }
    }

    return {
        title: `${property.titulo} | NexoCRM`,
        description: property.descripcion?.substring(0, 160) || 'Detalle de propiedad',
    }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const supabase = await createClient()

    const { data: property, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

    if (error || !property) {
        console.error('Error fetching property:', error)
        notFound()
    }

    return (
        <div className="max-w-7xl mx-auto py-6">
            <DetallePropiedad initialData={property} />
        </div>
    )
}
