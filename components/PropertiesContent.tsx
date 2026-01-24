'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/types'

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>
})

interface PropertiesContentProps {
    properties: Property[];
}

export default function PropertiesContent({ properties }: PropertiesContentProps) {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

    if (properties.length === 0) {
        return (
            <div className="text-center py-20 bg-bg-secondary/50 dark:bg-zinc-900/50 rounded-2xl border border-border-color dark:border-zinc-800">
                <p className="text-text-muted dark:text-zinc-400 text-lg">No properties found matching your criteria.</p>
                <p className="text-text-muted dark:text-zinc-500 mt-2 text-sm">Try adjusting your filters.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 ${viewMode === 'list'
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                                : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white'
                            }`}
                    >
                        List View
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 ${viewMode === 'map'
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                                : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white'
                            }`}
                    >
                        Map View
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <MapView properties={properties} />
            )}
        </div>
    )
}
