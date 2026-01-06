'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Property } from '@/types'

interface PropertyGalleryProps {
    images: string[]
    title: string
    status: Property['status']
}

export default function PropertyGallery({ images, title, status }: PropertyGalleryProps) {
    const t = useTranslations('PropertyDetails')
    const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1073&auto=format&fit=crop'
    // Ensure we have at least one image to display
    const displayImages = images && images.length > 0 ? images : [defaultImage]

    const [currentIndex, setCurrentIndex] = useState(0)
    const [imgError, setImgError] = useState<Record<number, boolean>>({})

    const handleImageError = (index: number) => {
        setImgError(prev => ({ ...prev, [index]: true }))
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % displayImages.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
    }

    const selectImage = (index: number) => {
        setCurrentIndex(index)
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border-color dark:border-zinc-800 bg-bg-secondary dark:bg-zinc-900 relative group">
                <img
                    src={imgError[currentIndex] ? defaultImage : displayImages[currentIndex]}
                    alt={`${title} - Image ${currentIndex + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500"
                    onError={() => handleImageError(currentIndex)}
                />

                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-white text-sm font-bold shadow-xl backdrop-blur-md border border-white/10 ${status === 'available'
                    ? 'bg-emerald-600/90'
                    : status === 'maintenance'
                        ? 'bg-orange-600/90'
                        : 'bg-red-600/90'
                    }`}>
                    {status === 'available' ? t('status.available') : status === 'maintenance' ? t('status.maintenance') : t('status.rented')}
                </div>

                {/* Navigation Arrows (Only show if multiple images) */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => selectImage(idx)}
                            className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${idx === currentIndex
                                ? 'border-indigo-500 opacity-100'
                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-border-color dark:hover:border-zinc-700'
                                }`}
                        >
                            <img
                                src={imgError[idx] ? defaultImage : img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="h-full w-full object-cover"
                                onError={() => handleImageError(idx)}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
