'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Property } from '@/types'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix for default marker icon in Leaflet with Next.js (and general webpack issues)
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
    properties: Property[];
}

export default function MapView({ properties }: MapViewProps) {

    // Default center (e.g. Los Angeles) if no properties, otherwise center on first property
    const defaultCenter: [number, number] = [34.0522, -118.2437];
    const center = properties.length > 0 ? [properties[0].lat, properties[0].lng] as [number, number] : defaultCenter;

    return (
        <MapContainer center={center} zoom={10} style={{ height: '500px', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {properties.map((property) => (
                <Marker key={property.id} position={[property.lat, property.lng]}>
                    <Popup>
                        <div className="text-sm">
                            <h3 className="font-bold">{property.title}</h3>
                            <p className="text-gray-600">${property.price.toLocaleString()}/mo</p>
                            <a href={`/properties/${property.id}`} className="text-indigo-600 hover:underline">View Details</a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
