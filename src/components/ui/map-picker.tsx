"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet clean icon issues in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface MapPickerProps {
    lat: number
    lng: number
    onLocationSelect: (lat: number, lng: number) => void
}

function LocationMarker({ lat, lng, onLocationSelect }: MapPickerProps) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return lat && lng ? <Marker position={[lat, lng]} /> : null
}

export default function MapPicker({ lat, lng, onLocationSelect }: MapPickerProps) {
    // Prevent SSR issues with Leaflet
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className="h-[300px] w-full bg-slate-100 rounded-md animate-pulse flex items-center justify-center text-muted-foreground">Cargando Mapa...</div>
    }

    // Default center (Monterrey or user selection)
    const center: [number, number] = lat && lng ? [lat, lng] : [25.6866, -100.3161]

    return (
        <div className="h-[400px] w-full rounded-md overflow-hidden border border-slate-300 z-0 relative">
            <MapContainer key={`${center[0]}-${center[1]}`} center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker lat={lat} lng={lng} onLocationSelect={onLocationSelect} />
            </MapContainer>
        </div>
    )
}
