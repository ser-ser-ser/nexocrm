"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Upload, ImagePlus, DollarSign, Zap, Droplets, Flame, Ruler, Leaf, FileText, MonitorPlay, MapPin } from "lucide-react"
import { NumericFormat } from "react-number-format"
import { uploadFiles } from "@/lib/upload"
import dynamic from "next/dynamic"

const MapPicker = dynamic(() => import("@/components/ui/map-picker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-md flex items-center justify-center text-muted-foreground">Cargando Mapa...</div>
})

export function NuevoDesarrolloDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // -- FORM STATE --
    // General
    const [nombre, setNombre] = useState("")
    const [tipo, setTipo] = useState<string>("industrial")
    // const [ubicacion, setUbicacion] = useState("") // Deprecated simple string

    // Detailed Address (V3 Request)
    const [calle, setCalle] = useState("")
    const [numero, setNumero] = useState("")
    const [colonia, setColonia] = useState("")
    const [cp, setCp] = useState("")
    const [municipio, setMunicipio] = useState("")
    const [estado, setEstado] = useState("Nuevo León")

    // Map Coords
    const [lat, setLat] = useState<number>(25.6866)
    const [lng, setLng] = useState<number>(-100.3161)

    // Amenidades (Lista simple)
    const [amenidadesList, setAmenidadesList] = useState<string[]>([])
    // V3: Sustentabilidad (Lista simple)
    const [sustentabilidadList, setSustentabilidadList] = useState<string[]>([])

    // Comercial
    const [moneda, setMoneda] = useState<"MXN" | "USD">("USD")
    const [precioDesde, setPrecioDesde] = useState<string>("")
    const [precioHasta, setPrecioHasta] = useState<string>("")
    const [mantenimiento, setMantenimiento] = useState<string>("")

    // Infraestructura / Proyecto
    const [superficieTotal, setSuperficieTotal] = useState<string>("") // m2 o has
    const [unidadesTotales, setUnidadesTotales] = useState<string>("")
    const [mixComercial, setMixComercial] = useState(false)
    const [kvas, setKvas] = useState("")
    const [agua, setAgua] = useState("Red Municipal")
    const [gas, setGas] = useState("No disponible")

    // Multimedia (Real Files)
    const [filesMasterPlan, setFilesMasterPlan] = useState<File[]>([])
    const [filesRenders, setFilesRenders] = useState<File[]>([])
    const [filesDocs, setFilesDocs] = useState<File[]>([])

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const toggleAmenidad = (amenidad: string) => {
        setAmenidadesList(prev =>
            prev.includes(amenidad)
                ? prev.filter(a => a !== amenidad)
                : [...prev, amenidad]
        )
    }

    const toggleSustentabilidad = (item: string) => {
        setSustentabilidadList(prev =>
            prev.includes(item)
                ? prev.filter(a => a !== item)
                : [...prev, item]
        )
    }

    const handleLocationSelect = (newLat: number, newLng: number) => {
        setLat(newLat)
        setLng(newLng)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFn: React.Dispatch<React.SetStateAction<File[]>>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFn(Array.from(e.target.files))
        }
    }

    const availableAmenities = [
        "Seguridad 24/7", "Control de Acceso", "CCTV", "Barda Perimetral",
        "Andenes Comunes", "Comedor", "Guarderia", "Centro de Negocios",
        "Espuela de Ferrocarril", "Canchas Deportivas", "Ciclovía", "Est. Visitas"
    ]

    const sustainabilityOptions = [
        "Certificación LEED", "Paneles Solares", "Planta de Tratamiento", "Pozo de Agua Propio", "Áreas Verdes Preservadas"
    ]

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No autenticado")

            // Clean numeric inputs
            const num = (val: string) => val ? Number(val.replace(/[^0-9.]/g, '')) : 0

            // Construct rich JSONB object
            // 1. Upload Files
            let masterPlanUrls: string[] = []
            let rendersUrls: string[] = []
            let docsUrls: string[] = []

            if (filesMasterPlan.length > 0) masterPlanUrls = await uploadFiles(filesMasterPlan, 'developments-docs', 'master-plans')
            if (filesRenders.length > 0) rendersUrls = await uploadFiles(filesRenders, 'developments-docs', 'renders')
            if (filesDocs.length > 0) docsUrls = await uploadFiles(filesDocs, 'developments-docs', 'documents')

            // 2. Construct Objects
            const fullAddress = `${calle} ${numero}, ${colonia}, ${municipio}, ${estado}, CP ${cp}`

            const amenidadesData = {
                amenities_list: amenidadesList,
                sustainability_list: sustentabilidadList,
                commercial_info: {
                    currency: moneda,
                    price_from: num(precioDesde),
                    price_to: num(precioHasta),
                    maintenance_fee: num(mantenimiento)
                },
                infrastructure: {
                    total_area: num(superficieTotal),
                    total_units: num(unidadesTotales),
                    commercial_mix: mixComercial,
                    kvas_total: kvas,
                    water_supply: agua,
                    natural_gas: gas
                },
                address_details: {
                    calle, numero, colonia, cp, municipio, estado
                },
                multimedia: {
                    master_plan: masterPlanUrls,
                    renders: rendersUrls,
                    documents: docsUrls
                }
            }

            const { error } = await supabase
                .from('desarrollos')
                .insert({
                    nombre,
                    tipo: tipo as "industrial" | "residencial" | "mixto",
                    ubicacion: fullAddress, // Summary string
                    amenidades: amenidadesData,
                    // Store strict postgis point if column exists, otherwise relying on amenidades or just summary
                    // Assuming schema might not have 'coords' yet, or using 'ubicacion' as text.
                    // If we wanted to store point: 
                    // location: `SRID=4326;POINT(${lng} ${lat})` 
                })

            if (error) throw error

            setOpen(false)
            router.refresh()

            // Reset form (Basic reset)
            // Reset form
            setNombre("")
            setCalle(""); setNumero(""); setColonia(""); setCp(""); setMunicipio("");
            setAmenidadesList([])
            setSustentabilidadList([])
            setFilesRenders([]); setFilesMasterPlan([]); setFilesDocs([]);

        } catch (error) {
            console.error(error)
            alert("Error al crear el desarrollo")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Desarrollo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[95vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Registrar Nuevo Desarrollo</DialogTitle>
                    <DialogDescription>
                        Configura un nuevo ecosistema inmobiliario (Parque, Plaza o Torre).
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 py-4">
                    <form id="desarrollo-form" onSubmit={onSubmit} className="space-y-8 pb-8">

                        {/* 1. Información General */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Información General</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="nombre">Nombre Comercial</Label>
                                    <Input
                                        id="nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Ej. Parque Industrial Finsa III"
                                        required
                                        className="text-lg"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="tipo">Vocación</Label>
                                        <Select value={tipo} onValueChange={setTipo}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="industrial">Industrial</SelectItem>
                                                <SelectItem value="residencial">Residencial</SelectItem>
                                                <SelectItem value="mixto">Usos Mixtos</SelectItem>
                                                <SelectItem value="comercial">Comercial / Plaza</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Address Fields */}
                                <div className="space-y-2 border rounded-md p-4 bg-slate-50/50">
                                    <h4 className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4" /> Dirección Física</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <div className="md:col-span-2">
                                            <Label className="text-xs">Calle</Label>
                                            <Input value={calle} onChange={e => setCalle(e.target.value)} placeholder="Av. Principal" className="h-8" />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Número</Label>
                                            <Input value={numero} onChange={e => setNumero(e.target.value)} placeholder="123" className="h-8" />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Colonia</Label>
                                            <Input value={colonia} onChange={e => setColonia(e.target.value)} placeholder="Colonia" className="h-8" />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Código Postal</Label>
                                            <Input value={cp} onChange={e => setCp(e.target.value)} placeholder="00000" className="h-8" />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Municipio</Label>
                                            <Input value={municipio} onChange={e => setMunicipio(e.target.value)} placeholder="Municipio" className="h-8" />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Estado</Label>
                                            <Input value={estado} onChange={e => setEstado(e.target.value)} placeholder="Nuevo León" className="h-8" />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[250px] w-full rounded-md overflow-hidden border">
                                    <MapPicker
                                        onLocationSelect={handleLocationSelect}
                                        initialLat={lat}
                                        initialLng={lng}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Comercial y Precios */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase flex items-center gap-2">
                                <DollarSign className="h-4 w-4" /> Comercial
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                <div className="col-span-1 md:col-span-3 flex justify-end">
                                    <div className="flex bg-white dark:bg-slate-800 rounded-md p-1 border">
                                        <button type="button" onClick={() => setMoneda("MXN")} className={`px-3 py-1 text-xs font-bold rounded ${moneda === 'MXN' ? 'bg-primary text-primary-foreground' : ''}`}>MXN</button>
                                        <button type="button" onClick={() => setMoneda("USD")} className={`px-3 py-1 text-xs font-bold rounded ${moneda === 'USD' ? 'bg-primary text-primary-foreground' : ''}`}>USD</button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Precio Desde ({moneda})</Label>
                                    <NumericFormat
                                        value={precioDesde}
                                        onValueChange={(v) => setPrecioDesde(v.value)}
                                        thousandSeparator customInput={Input} placeholder="0.00"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Precio Hasta ({moneda})</Label>
                                    <NumericFormat
                                        value={precioHasta}
                                        onValueChange={(v) => setPrecioHasta(v.value)}
                                        thousandSeparator customInput={Input} placeholder="0.00"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Mantenimiento ({moneda}/m²)</Label>
                                    <NumericFormat
                                        value={mantenimiento}
                                        onValueChange={(v) => setMantenimiento(v.value)}
                                        thousandSeparator customInput={Input} placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Infraestructura */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase flex items-center gap-2">
                                <Zap className="h-4 w-4" /> Infraestructura & Proyecto
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="flex items-center gap-1"><Ruler className="w-3 h-3" /> Sup. Total (m²)</Label>
                                            <NumericFormat value={superficieTotal} onValueChange={(v) => setSuperficieTotal(v.value)} thousandSeparator customInput={Input} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Unidades Totales</Label>
                                            <NumericFormat value={unidadesTotales} onValueChange={(v) => setUnidadesTotales(v.value)} thousandSeparator customInput={Input} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border p-3 rounded-md">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Mix Comercial / Retail</span>
                                            <span className="text-xs text-muted-foreground">Incluye zona comercial</span>
                                        </div>
                                        <Switch checked={mixComercial} onCheckedChange={setMixComercial} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label className="flex items-center gap-1"><Zap className="w-3 h-3" /> Capacidad Eléctrica (KVA)</Label>
                                        <Input value={kvas} onChange={(e) => setKvas(e.target.value)} placeholder="Ej. 10,000 KVA Totales" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="flex items-center gap-1"><Droplets className="w-3 h-3" /> Abasto de Agua</Label>
                                        <Select value={agua} onValueChange={setAgua}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Red Municipal">Red Municipal</SelectItem>
                                                <SelectItem value="Pozo Propio">Pozo Propio</SelectItem>
                                                <SelectItem value="Sistema Híbrido">Sistema Híbrido</SelectItem>
                                                <SelectItem value="No Disponible">No Disponible</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="flex items-center gap-1"><Flame className="w-3 h-3" /> Gas Natural</Label>
                                        <Select value={gas} onValueChange={setGas}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Disponible">Disponible (Red)</SelectItem>
                                                <SelectItem value="A pie de lote">A pie de lote</SelectItem>
                                                <SelectItem value="No disponible">No disponible</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Amenidades y Sustentabilidad */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Amenidades y Servicios</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4 bg-slate-50 dark:bg-slate-900/50 max-h-[200px] overflow-y-auto">
                                    {availableAmenities.map((am) => (
                                        <div key={am} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`am-${am}`}
                                                checked={amenidadesList.includes(am)}
                                                onCheckedChange={() => toggleAmenidad(am)}
                                            />
                                            <Label htmlFor={`am-${am}`} className="text-xs cursor-pointer">{am}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase flex items-center gap-2">
                                    <Leaf className="h-4 w-4" /> Sustentabilidad
                                </h3>
                                <div className="grid grid-cols-1 gap-2 border rounded-md p-4 bg-slate-50 dark:bg-slate-900/50 max-h-[200px] overflow-y-auto">
                                    {sustainabilityOptions.map((am) => (
                                        <div key={am} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`sus-${am}`}
                                                checked={sustentabilidadList.includes(am)}
                                                onCheckedChange={() => toggleSustentabilidad(am)}
                                            />
                                            <Label htmlFor={`sus-${am}`} className="text-xs cursor-pointer">{am}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 5. Multimedia V3 */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase flex items-center gap-2">
                                <ImagePlus className="h-4 w-4" /> Multimedia y Archivos
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40 text-center relative hover:bg-slate-100 transition-colors">
                                    <Upload className="h-6 w-6 text-slate-400 mb-2" />
                                    <p className="text-sm font-medium">Master Plan / Logo</p>
                                    <p className="text-[10px] text-muted-foreground mb-2">PNG, JPG</p>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setFilesMasterPlan)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    {filesMasterPlan.length > 0 && <span className="text-xs text-emerald-600 font-bold">{filesMasterPlan.length} archivo(s)</span>}
                                </div>

                                <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40 text-center relative hover:bg-slate-100 transition-colors">
                                    <MonitorPlay className="h-6 w-6 text-slate-400 mb-2" />
                                    <p className="text-sm font-medium">Renders</p>
                                    <p className="text-[10px] text-muted-foreground mb-2">Perspectivas 3D</p>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleFileChange(e, setFilesRenders)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    {filesRenders.length > 0 && <span className="text-xs text-emerald-600 font-bold">{filesRenders.length} archivo(s)</span>}
                                </div>

                                <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40 text-center relative hover:bg-slate-100 transition-colors">
                                    <FileText className="h-6 w-6 text-slate-400 mb-2" />
                                    <p className="text-sm font-medium">Documentos</p>
                                    <p className="text-[10px] text-muted-foreground mb-2">PDF, Brochure</p>
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        multiple
                                        onChange={(e) => handleFileChange(e, setFilesDocs)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    {filesDocs.length > 0 && <span className="text-xs text-emerald-600 font-bold">{filesDocs.length} archivo(s)</span>}
                                </div>

                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                * Los archivos se subirán automáticamente al guardar el desarrollo.
                            </p>
                        </div>

                    </form>
                </ScrollArea>

                <DialogFooter className="p-6 pt-2 border-t bg-background z-10">
                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" form="desarrollo-form" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Registrar Desarrollo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
