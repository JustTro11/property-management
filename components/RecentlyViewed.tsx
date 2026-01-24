'use client'

import { useEffect, useState } from 'react'
import { Property } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

import { useTranslations } from 'next-intl'

export default function RecentlyViewed({ currentPropertyId }: { currentPropertyId: string }) {
    const t = useTranslations('RecentlyViewed')
    const [recentProperties, setRecentProperties] = useState<Property[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const fetchProperties = async () => {
            const stored = localStorage.getItem('recently_viewed')
            if (!stored) {
                setIsLoaded(true)
                return
            }

            try {
                const ids: string[] = JSON.parse(stored)

                // Filter out current property
                const filteredIds = ids.filter(id => id !== currentPropertyId)

                if (filteredIds.length === 0) {
                    setRecentProperties([])
                    setIsLoaded(true)
                    return
                }

                // Fetch data via API to avoid Server Component imports in Client Component
                const response = await fetch('/api/properties/batch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: filteredIds })
                })

                if (!response.ok) throw new Error('Failed to fetch properties')
                const data: Property[] = await response.json()

                // Order matters: match the order of IDs in localStorage
                const orderedData = filteredIds
                    .map(id => data.find((p: Property) => p.id === id))
                    .filter((p): p is Property => !!p)

                setRecentProperties(orderedData)
            } catch (e) {
                console.error('Failed to fetch recently viewed properties', e)
            } finally {
                setIsLoaded(true)
            }
        }

        fetchProperties()
    }, [currentPropertyId])

    if (!isLoaded || recentProperties.length === 0) return null

    return (
        <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-10">
            <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-6">{t('title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentProperties.map(property => (
                    <Link
                        key={property.id}
                        href={`/properties/${property.id}`}
                        className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-lg"
                    >
                        <div className="relative h-40 bg-zinc-100">
                            <Image
                                src={Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : (property.image_url || 'https://images.unsplash.com/photo-1560518883')}
                                alt={property.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-4">
                            <h4 className="font-semibold text-text-primary dark:text-white line-clamp-1 group-hover:text-indigo-500 transition-colors">
                                {property.title}
                            </h4>
                            <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                                ${property.price.toLocaleString()}
                                <span className="text-xs text-zinc-500 font-normal ml-1">{t('perMonth')}</span>
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
