"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

import { uploadFiles } from "@/lib/upload"
import dynamic from "next/dynamic"
import { NumericFormat } from "react-number-format"
import { MapPin, ImagePlus, DollarSign, Building2, Video, Car, Network, Briefcase, Percent, ShieldCheck, Plus, Trash2, X, Star, Save, Send } from "lucide-react"

import { IndustrialFields } from "./fields/industrial-fields"
import { CommercialFields } from "./fields/commercial-fields"
import { ResidentialFields } from "./fields/residential-fields"

const MapPicker = dynamic(() => import("@/components/ui/map-picker"), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-slate-100 animate-pulse rounded-md flex items-center justify-center">Cargando Mapa...</div>
})

export default function FormularioPropiedad() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [categoria, setCategoria] = useState<string>("industrial")
    const [subtipo, setSubtipo] = useState<string>("")

    // Location & State
    const [lat, setLat] = useState<number>(25.6866)
    const [lng, setLng] = useState<number>(-100.3161)
    const [moneda, setMoneda] = useState<"MXN" | "USD">("MXN")
    const [multimedia, setMultimedia] = useState<File[]>([])

    // --- Polymorphic Fields State ---
    interface SubUnidad {
        id: string
        nombre: string
        m2_construccion: string
        m2_terreno: string
        precio: string
        estatus: string
    }
    const [subUnidades, setSubUnidades] = useState<SubUnidad[]>([])

    // Auto-init for Industrial
    useEffect(() => {
        if (categoria === 'industrial') {
            if (subtipo === '') setSubtipo('nave_industrial')
            if (subUnidades.length === 0) {
                setSubUnidades([{
                    id: crypto.randomUUID(),
                    nombre: 'Bodega 1',
                    m2_construccion: '',
                    m2_terreno: '',
                    precio: '',
                    estatus: 'disponible'
                }])
            }
        } else if (categoria === 'comercial') {
            if (subtipo === '') setSubtipo('local')
            // Auto-init sub-units for Plazas/Edificios
            if ((subtipo === 'plaza' || subtipo === 'edificio') && subUnidades.length === 0) {
                setSubUnidades([{
                    id: crypto.randomUUID(),
                    nombre: 'Local 1',
                    m2_construccion: '',
                    m2_terreno: '',
                    precio: '',
                    estatus: 'disponible'
                }])
            }
        } else if (categoria === 'oficina') {
            // 'oficina' main category might be mapped to commercial subtype 'oficina' internally or just handled as OFFICE
            if (subtipo === '') setSubtipo('oficina')
        }
    }, [categoria, subUnidades, subtipo])

    // V3: Extras
    const [vocacion, setVocacion] = useState<string>("")
    const [comisionTotal, setComisionTotal] = useState<string>("")
    const [comparteComision, setComparteComision] = useState(false)
    const [porcentajeCompartir, setPorcentajeCompartir] = useState<string>("")
    const [visibleRed, setVisibleRed] = useState(false)

    // Amenities List
    const [amenidadesList, setAmenidadesList] = useState<string[]>([])

    const availableAmenities = [
        "Seguridad 24/7", "Control de Acceso", "CCTV", "Barda Perimetral",
        "Andenes Comunes", "Comedor", "Guarderia", "Centro de Negocios",
        "Espuela de Ferrocarril", "Canchas Deportivas", "Ciclovía", "Est. Visitas"
    ]

    const toggleAmenidad = (amenidad: string) => {
        setAmenidadesList(prev =>
            prev.includes(amenidad) ? prev.filter(a => a !== amenidad) : [...prev, amenidad]
        )
    }

    const handleLocationSelect = (newLat: number, newLng: number) => {
        setLat(newLat)
        setLng(newLng)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setMultimedia(Array.from(e.target.files))
        }
    }

    // --- Sub-Units Logic ---
    const addSubUnidad = () => {
        setSubUnidades([...subUnidades, {
            id: crypto.randomUUID(),
            nombre: "",
            m2_terreno: "",
            m2_construccion: "",
            precio: "",
            estatus: "disponible"
        }])
    }

    const removeSubUnidad = (id: string) => {
        setSubUnidades(subUnidades.filter(u => u.id !== id))
    }

    const updateSubUnidad = (id: string, field: keyof typeof subUnidades[0], value: string) => {
        setSubUnidades(subUnidades.map(u => u.id === id ? { ...u, [field]: value } : u))
    }

    // --- Image Logic ---
    const removeImage = (index: number) => {
        setMultimedia(multimedia.filter((_, i) => i !== index))
    }

    const setCoverImage = (index: number) => {
        const newImages = [...multimedia]
        const [selected] = newImages.splice(index, 1)
        newImages.unshift(selected)
        setMultimedia(newImages)
    }

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // --- SUBMISSION ---
    async function onSubmit(event: React.FormEvent<HTMLFormElement>, status: 'borrador' | 'publicada') {
        event.preventDefault()

        // Form needs to be retrieved from context/state depending on button, 
        // but since buttons are inside form, we can use the form element.
        // HOWEVER, since we have two buttons calling this, we need to handle the event correctly.
        // We'll wrapper this.
    }

    const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>, targetStatus: 'borrador' | 'publicada') => {
        e.preventDefault()
        // Find the form element
        const form = document.querySelector('form') as HTMLFormElement
        if (!form) return

        setIsLoading(true)

        const helper = {
            num: (val: any) => (val && !isNaN(Number(val)) ? Number(val) : null),
            bool: (val: any) => val === "on",
            str: (val: any) => (val ? String(val) : null)
        }
        const { num, bool, str } = helper

        try {
            // Auth Check
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No sesión activa")

            const { data: profile } = await supabase.from('perfiles').select('id').eq('id', user.id).single()
            if (!profile) throw new Error("Perfil no encontrado")

            const formData = new FormData(form)
            const data = Object.fromEntries(formData)

            // 1. Basic Columns
            const calle = str(data.calle) || ''
            const numExt = str(data.num_exterior) || ''
            const colonia = data.colonia ? `, Col. ${data.colonia}` : ''
            const ciudad = str(data.ciudad) || ''
            const fullAddress = `${calle} ${numExt}${colonia}, ${ciudad}, ${data.estado}, ${data.pais}`.trim()

            const rawPrice = data.price ? Number(String(data.price).replace(/[^0-9.]/g, '')) : 0

            // Superficies (Real Columns now)
            // If sub-units exist and main is zero, sum them up
            let supTotal = num(data.superficie_total)
            let supConstruida = num(data.superficie_construida)

            const subUnitsPayload = subUnidades.map(u => ({
                id: u.id,
                nombre: u.nombre,
                m2_terreno: num(u.m2_terreno),
                m2_construccion: num(u.m2_construccion),
                precio: num(u.precio),
                estatus: u.estatus
            }))

            if (!supTotal && subUnitsPayload.length > 0) {
                // If user didn't fill global total but added units, sum construction/land
                supTotal = subUnitsPayload.reduce((acc, curr) => acc + (curr.m2_terreno || 0), 0)
                supConstruida = subUnitsPayload.reduce((acc, curr) => acc + (curr.m2_construccion || 0), 0)
            }

            // 2. Insert PROPERTY Row
            const propiedadInsert = {
                titulo: str(data.title),
                descripcion: str(data.description),
                precio: rawPrice,
                moneda: moneda,
                operacion: data.operation as any,
                tipo: categoria as any,
                estado: targetStatus, // borrador | publicada

                // Location
                direccion: fullAddress,
                ubicacion: `(${lng},${lat})`, // Point
                ciudad: ciudad,

                // New Real Columns
                superficie_total: supTotal,
                superficie_construida: supConstruida,
                superficie_terreno: num(data.superficie_terreno),

                // Root Columns per Strict Schema
                altura: num(data.altura),
                subtipo: str(data.subtipo),

                // Commissions (Private)
                comision_esquema: `Total: ${comisionTotal}% | Comparte: ${porcentajeCompartir}%`,
                comparte_comision: comparteComision,
                visible_red_brokers: visibleRed,

                propietario_id: user.id,

                // CHARACTERISTICS (JSONB)
                caracteristicas: {} // Will fill below
            }

            // 3. Construct Polymorphic JSONB
            let caracteristicas: Record<string, any> = {
                video_url: str(data.video_url),
                conectividad: str(data.conectividad),
                vocacion: vocacion || null,
                amenidades: amenidadesList,
                mantenimiento_mensual: num(data.mantenimiento),
                precio_m2_referencia: num(data.precio_m2),
                invitacion_broker_email: str(data.invitacion_broker),
                ubicacion_detallada: {
                    calle, num_exterior: numExt, colonia: str(data.colonia), cp: str(data.cp),
                    ciudad, estado: str(data.estado), pais: str(data.pais)
                }
            }

            if (categoria === 'industrial') {
                // Handle Espuela manually to amenities if checked
                if (bool(data.espuela_ferrocarril)) {
                    amenidadesList.push("Espuela de Ferrocarril")
                }

                caracteristicas = {
                    ...caracteristicas,
                    // Nested Structures per User Request
                    logistica: {
                        andenes_carga: num(data.andenes_carga),
                        rampas_nivel_piso: num(data.rampas_nivel_piso),
                        cross_docking: bool(data.cross_docking),
                        acceso_trailer_53: bool(data.acceso_trailer_53),
                        patio_maniobras_m: num(data.patio_maniobras_m)
                    },
                    construccion: {
                        resistencia_piso_ton_m2: num(data.resistencia_piso_ton_m2),
                        tipo_techo: str(data.tipo_techo),
                        iluminacion_natural_pct: num(data.iluminacion_natural_pct),
                        altura_libre_m: num(data.altura) // Also stored in root 'altura'
                    },
                    servicios: {
                        kvas_disponibles: num(data.kvas_disponibles),
                        sistema_contra_incendios: str(data.sistema_contra_incendios)
                    },
                    sustentabilidad: {
                        certificacion_leed: bool(data.certificacion_leed),
                        paneles_solares: bool(data.paneles_solares),
                        planta_tratamiento_agua: bool(data.planta_tratamiento_agua),
                        sistema_captacion_pluvial: bool(data.sistema_captacion_pluvial)
                    },
                    sub_unidades: subUnitsPayload // Preserved
                }
            } else if (categoria === 'residencial') {
                caracteristicas = {
                    ...caracteristicas,
                    // New Residential Structure
                    amenidades: Object.keys(data)
                        .filter(key => key.startsWith('amenidad_') && data[key] === 'on')
                        .map(key => key.replace('amenidad_', ''))
                        .concat(str(data.amenidades_residenciales) ? String(data.amenidades_residenciales).split(',') : []), // Keep fallbacks just in case
                    servicios_interior: {
                        cuarto_servicio: bool(data.cuarto_servicio),
                        cuarto_lavado: bool(data.cuarto_lavado),
                        aire_acondicionado_minisplit: bool(data.aire_acondicionado_minisplit)
                    },
                    reglas: {
                        mascotas_permitidas: bool(data.mascotas_permitidas)
                    },
                    exterior: {
                        jardin_privado: bool(data.jardin_privado),
                        vigilancia_24_7: bool(data.vigilancia_24_7)
                    },
                    // Compatibility root fields
                    recamaras: num(data.recamaras),
                    banos_completos: num(data.banos_completos),
                    medios_banos: num(data.medios_banos),
                    estacionamientos: num(data.estacionamientos),
                    niveles: num(data.niveles_plantas),
                    pet_friendly: bool(data.pet_friendly), // kept for quick access
                    amueblado: bool(data.amueblado)
                }
            } else if (categoria === 'comercial' || categoria === 'oficina') {
                // Determine standard structure based on subtipo
                const isOffice = subtipo === 'oficina' || subtipo === 'corporativo' || categoria === 'oficina';

                caracteristicas = {
                    ...caracteristicas,
                    local_retail: !isOffice ? {
                        frente_metros: num(data.frente_metros),
                        altura_libre: num(data.altura_libre),
                        a_pie_de_calle: bool(data.a_pie_de_calle),
                        en_esquina: bool(data.en_esquina),
                        tiene_terraza: bool(data.tiene_terraza),
                        acometida_gas: bool(data.acometida_gas),
                        giros_permitidos: str(data.giros_permitidos) ? String(data.giros_permitidos).split(',') : [],
                        guante_traspaso_mxn: num(data.guante_traspaso_mxn)
                    } : undefined,
                    oficina: isOffice ? {
                        tipo_entrega: str(data.tipo_entrega) as any,
                        ratio_estacionamiento: str(data.ratio_estacionamiento),
                        sistema_aire_acondicionado: str(data.sistema_aire_acondicionado) as any,
                        certificacion_leed: bool(data.certificacion_leed),
                        control_acceso: bool(data.control_acceso),
                        elevadores_cantidad: num(data.elevadores_cantidad)
                    } : undefined,

                    // Legacy/Root compatibility (Prefer global input if set)
                    mantenimiento_mensual: num(data.mantenimiento) || num(data.mantenimiento_mensual_comercial),
                }
            }

            propiedadInsert.caracteristicas = caracteristicas

            // ACTUALLY INSERT PROPERTY
            const { data: propData, error: propError } = await supabase
                .from('propiedades')
                .insert(propiedadInsert)
                .select('id')
                .single()

            if (propError) throw propError
            const propiedadId = propData.id

            // 4. Handle Multimedia (Table)
            if (multimedia.length > 0) {
                // Upload files first
                // TODO: folderPath could include ID if we had it before, but we just got it. 
                // We'll put them in a folder named after ID for cleanliness
                const uploadedUrls = await uploadFiles(multimedia, 'properties-images', propiedadId)

                // Insert into 'multimedia' table
                const mediaInserts = uploadedUrls.map((url, index) => ({
                    propiedad_id: propiedadId,
                    ruta: url,
                    tipo: 'imagen',
                    creado_por: user.id,
                    metadata: {
                        orden: index,
                        es_portada: index === 0
                    }
                }))

                const { error: mediaError } = await supabase.from('multimedia').insert(mediaInserts)
                if (mediaError) console.error("Error saving media rows:", mediaError)

                // Also update main property image_principal for speed (redundancy is ok here)
                if (uploadedUrls.length > 0) {
                    await supabase.from('propiedades').update({ imagen_principal: uploadedUrls[0] }).eq('id', propiedadId)
                }
            }

            // Success
            router.push('/dashboard/inventario')
            router.refresh()

        } catch (error: any) {
            console.error(error)
            alert(`Error: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <Card className="w-full max-w-4xl mx-auto border-none shadow-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">Nueva Propiedad</CardTitle>
                    <CardDescription>
                        Ficha Técnica Inteligente • {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* CATEGORY & OPERATION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Categoría del Activo</Label>
                            <Select value={categoria} onValueChange={(val) => {
                                setCategoria(val)
                                if (val === 'industrial' && subUnidades.length === 0) {
                                    setSubUnidades([{
                                        id: crypto.randomUUID(),
                                        nombre: 'Bodega 1',
                                        m2_construccion: '',
                                        m2_terreno: '',
                                        precio: '',
                                        estatus: 'disponible'
                                    }])
                                }
                                if (val === 'industrial' && subUnidades.length === 0) {
                                    setSubUnidades([{
                                        id: crypto.randomUUID(),
                                        nombre: 'Bodega 1',
                                        m2_construccion: '',
                                        m2_terreno: '',
                                        precio: '',
                                        estatus: 'disponible'
                                    }])
                                } else {
                                    setSubUnidades([]) // Reset if switching unless handled by effect
                                }
                            }}>
                                <SelectTrigger className="w-full h-12 text-lg font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="industrial">Industrial / Logístico</SelectItem>
                                    <SelectItem value="comercial">Comercial / Retail</SelectItem>
                                    <SelectItem value="residencial">Residencial</SelectItem>
                                    <SelectItem value="terreno">Terreno</SelectItem>
                                    <SelectItem value="oficina">Oficina</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {categoria === 'industrial' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label>Subtipo Industrial</Label>
                                <Select name="subtipo" value={subtipo} onValueChange={setSubtipo}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nave_industrial">Nave Industrial</SelectItem>
                                        <SelectItem value="bodega">Bodega</SelectItem>
                                        <SelectItem value="logistica">Logística / Cross Dock</SelectItem>
                                        <SelectItem value="manufactura">Manufactura</SelectItem>
                                        <SelectItem value="ultima_milla">Última Milla</SelectItem>
                                        <SelectItem value="parque_industrial">Parque Industrial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {categoria === 'comercial' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label>Subtipo Comercial</Label>
                                <Select name="subtipo" value={subtipo} onValueChange={setSubtipo}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="local">Local Comercial</SelectItem>
                                        <SelectItem value="plaza">Local en Plaza</SelectItem>
                                        <SelectItem value="isla">Isla</SelectItem>
                                        <SelectItem value="oficina">Oficina</SelectItem>
                                        <SelectItem value="edificio">Edificio Completo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Tipo de Operación</Label>
                            <Select name="operation" defaultValue="venta">
                                <SelectTrigger className="h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="venta">Venta</SelectItem>
                                    <SelectItem value="renta">Renta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-lg">Título del Anuncio</Label>
                        <Input name="title" className="text-lg h-12" placeholder="Ej. Nave Industrial AAA en Parque Finsa" required />
                    </div>

                    <div className="space-y-2">
                        <Label>Descripción Detallada</Label>
                        <Textarea
                            name="description"
                            placeholder="Describe las características destacadas, accesos, ventajas competitivas..."
                            className="min-h-[120px] text-base"
                        />
                    </div>

                    {/* SUPERFICIES (New Core Columns) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Superficie Total (m²)</Label>
                            <NumericFormat name="superficie_total" className="flex h-10 w-full rounded-md border border-input px-3 py-2" placeholder="Total operativo" thousandSeparator={true} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Construido (m²)</Label>
                            <NumericFormat name="superficie_construida" className="flex h-10 w-full rounded-md border border-input px-3 py-2" placeholder="Techado/Nave" thousandSeparator={true} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Terreno (m²)</Label>
                            <NumericFormat name="superficie_terreno" className="flex h-10 w-full rounded-md border border-input px-3 py-2" placeholder="Superficie Tierra" thousandSeparator={true} />
                        </div>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* UBICACION */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-semibold text-lg text-slate-700 dark:text-slate-300"><MapPin className="h-5 w-5" /> Ubicación</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="col-span-2 md:col-span-3 space-y-2"><Label>Calle</Label><Input name="calle" /></div>
                            <div className="space-y-2"><Label>No. Ext</Label><Input name="num_exterior" /></div>
                            <div className="space-y-2"><Label>No. Int</Label><Input name="num_interior" /></div>
                            <div className="col-span-2 space-y-2"><Label>Colonia</Label><Input name="colonia" /></div>
                            <div className="space-y-2"><Label>CP</Label><Input name="cp" /></div>
                            <div className="col-span-2 space-y-2"><Label>Ciudad *</Label><Input name="ciudad" required /></div>
                            <div className="space-y-2"><Label>Estado</Label><Input name="estado" defaultValue="Nuevo León" /></div>
                            <div className="space-y-2"><Label>País</Label><Input name="pais" defaultValue="México" /></div>
                        </div>
                        <div className="pt-2">
                            <Label>Pin en Mapa</Label>
                            <MapPicker lat={lat} lng={lng} onLocationSelect={handleLocationSelect} />
                        </div>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* POLYMORPHIC FIELDS */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        {categoria === 'industrial' && <IndustrialFields />}
                        {categoria === 'comercial' && <CommercialFields subtipo={subtipo} />}
                        {categoria === 'oficina' && <CommercialFields subtipo="oficina" />}
                        {categoria === 'residencial' && <ResidentialFields />}
                    </div>

                    {/* SUB-UNIDADES (Industrial OR Commercial Plaza/Edificio) */}
                    {(categoria === 'industrial' || (categoria === 'comercial' && (subtipo === 'plaza' || subtipo === 'edificio'))) && (
                        <div className="space-y-4 pt-4 border-t border-dashed">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold flex items-center gap-2">
                                    <Building2 className="h-5 w-5" /> Sub-Unidades ({categoria === 'industrial' ? 'Bodegas' : 'Locales'})
                                </Label>
                                <Button type="button" onClick={addSubUnidad} variant="outline" size="sm" className="gap-2 border-dashed">
                                    <Plus className="h-4 w-4" /> Agregar
                                </Button>
                            </div>

                            {subUnidades.map((u, i) => (
                                <div key={u.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <div className="md:col-span-1"><Label className="text-xs mb-1.5 block text-slate-500">Nombre / ID</Label><Input value={u.nombre} onChange={e => updateSubUnidad(u.id, 'nombre', e.target.value)} placeholder={categoria === 'industrial' ? "Ej. Bodega 1" : "Ej. Local A-10"} className="bg-white" /></div>
                                    <div className="md:col-span-1"><Label className="text-xs mb-1.5 block text-slate-500">M² Cons.</Label><NumericFormat value={u.m2_construccion} onValueChange={v => updateSubUnidad(u.id, 'm2_construccion', v.value)} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Ej. 250" thousandSeparator={true} /></div>
                                    <div className="md:col-span-1"><Label className="text-xs mb-1.5 block text-slate-500">M² Terr.</Label><NumericFormat value={u.m2_terreno} onValueChange={v => updateSubUnidad(u.id, 'm2_terreno', v.value)} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Ej. 500" thousandSeparator={true} /></div>
                                    <div className="md:col-span-1"><Label className="text-xs mb-1.5 block text-slate-500">Precio</Label><NumericFormat value={u.precio} onValueChange={v => updateSubUnidad(u.id, 'precio', v.value)} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" prefix="$" placeholder="Ej. 15,000" thousandSeparator={true} /></div>
                                    <div className="flex justify-end"><Button variant="ghost" size="icon" onClick={() => removeSubUnidad(u.id)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50"><Trash2 className="h-5 w-5" /></Button></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* MULTIMEDIA */}
                    <div className="space-y-4 pt-4">
                        <Label className="flex items-center gap-2 text-lg font-semibold"><ImagePlus className="h-5 w-5" /> Multimedia</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="col-span-2 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 cursor-pointer relative min-h-[150px]">
                                <ImagePlus className="h-8 w-8 text-slate-400" />
                                <p className="text-sm">Subir Fotos</p>
                                <Input type="file" accept="image/*" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            {multimedia.map((file, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border">
                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-2">
                                        <div className="flex justify-end"><X className="h-5 w-5 text-white cursor-pointer" onClick={() => removeImage(i)} /></div>
                                        {i === 0 ? <div className="bg-primary text-white text-xs px-2 py-1 rounded w-fit">PORTADA</div> : <Button size="sm" variant="secondary" className="text-xs h-6" onClick={() => setCoverImage(i)}>Hacer Portada</Button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PRECIO & COMISIONES */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Precio Total ({moneda})</Label>
                                <div className="flex">
                                    <NumericFormat name="price" className="flex h-10 w-full rounded-l-md border border-input px-3 py-2" placeholder="0.00" thousandSeparator={true} prefix="$ " />
                                    <Select value={moneda} onValueChange={(v: any) => setMoneda(v)}><SelectTrigger className="w-20 rounded-l-none bg-slate-100"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MXN">MXN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Mantenimiento (Mensual)</Label>
                                <NumericFormat name="mantenimiento" className="flex h-10 w-full rounded-md border border-input px-3 py-2" placeholder="$ 0.00" thousandSeparator={true} prefix="$ " />
                            </div>
                            <div className="space-y-2">
                                <Label>Precio x M² (Ref.)</Label>
                                <NumericFormat name="precio_m2" className="flex h-10 w-full rounded-md border border-input px-3 py-2 bg-slate-50" placeholder="Auto o Manual" thousandSeparator={true} prefix="$ " />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Vocación Ideal</Label>
                            <Select onValueChange={setVocacion} value={vocacion}>
                                <SelectTrigger className="h-12"><SelectValue placeholder="Seleccionar vocación..." /></SelectTrigger>
                                <SelectContent>
                                    {categoria === 'industrial' && (
                                        <>
                                            <SelectItem value="logistica">Logística / Distribución</SelectItem>
                                            <SelectItem value="manufactura">Manufactura Ligera</SelectItem>
                                            <SelectItem value="cedis">CEDIS Regional</SelectItem>
                                            <SelectItem value="ultima_milla">Última Milla</SelectItem>
                                        </>
                                    )}
                                    {categoria === 'comercial' && (
                                        <>
                                            <SelectItem value="restaurante">Restaurante / F&B</SelectItem>
                                            <SelectItem value="retail">Retail / Moda</SelectItem>
                                            <SelectItem value="servicios">Servicios / Banco</SelectItem>
                                            <SelectItem value="tecnologia">Tecnología / Showroom</SelectItem>
                                        </>
                                    )}
                                    {(categoria === 'oficina' || subtipo === 'oficina') && (
                                        <>
                                            <SelectItem value="corporativo">Corporativo</SelectItem>
                                            <SelectItem value="coworking">Coworking</SelectItem>
                                            <SelectItem value="call_center">Call Center</SelectItem>
                                            <SelectItem value="consultorios">Consultorios</SelectItem>
                                        </>
                                    )}
                                    {/* Fallback or General */}
                                    <SelectItem value="inversion">Inversión Patrimonial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Commissions Block */}
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2"><Label>Comisión Total (%)</Label><NumericFormat value={comisionTotal} onValueChange={v => setComisionTotal(v.value)} className="flex h-10 w-full rounded border px-3" suffix="%" /></div>
                                <div className="flex items-center justify-between border bg-white p-2 rounded"><span className="text-sm">¿Comparte?</span><Switch checked={comparteComision} onCheckedChange={setComparteComision} /></div>
                                {comparteComision && <div className="space-y-2"><Label>% a Compartir</Label><NumericFormat value={porcentajeCompartir} onValueChange={v => setPorcentajeCompartir(v.value)} className="flex h-10 w-full rounded border px-3" suffix="%" /></div>}
                                <div className="col-span-full pt-2 border-t border-yellow-200 mt-2">
                                    <Label className="text-xs font-bold uppercase text-yellow-700">Invitación Directa (Email)</Label>
                                    <Input name="invitacion_broker" placeholder="correo@broker-aliado.com" className="bg-white mt-1" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2"><Checkbox checked={visibleRed} onCheckedChange={(c) => setVisibleRed(!!c)} id="visible" /><Label htmlFor="visible">Visible en Red de Brokers (Marketplace)</Label></div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-between gap-4 sticky bottom-0 bg-background/90 backdrop-blur-sm p-6 border-t z-10">
                    <Button variant="outline" type="button" onClick={(e) => handleFinalSubmit(e, 'borrador')} disabled={isLoading} className="gap-2">
                        <Save className="h-4 w-4" /> Guardar Borrador
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="ghost" type="button" onClick={() => router.back()}>Cancelar</Button>
                        <Button type="button" onClick={(e) => handleFinalSubmit(e, 'publicada')} disabled={isLoading} className="bg-primary text-primary-foreground gap-2">
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />} Publicar
                        </Button>
                    </div>
                </CardFooter>
            </Card >
        </form >
    )
}
