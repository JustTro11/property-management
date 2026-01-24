'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { useEffect, useState } from 'react'
import { MouseEvent } from 'react'

export default function FavoriteButton({ propertyId }: { propertyId: string }) {
    const { isFavorite, toggleFavorite, isLoaded } = useFavorites()
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            setLiked(isFavorite(propertyId))
        }
    }, [isFavorite, propertyId, isLoaded])

    const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(propertyId)
    }

    if (!isLoaded) return null

    return (
        <button
            onClick={handleClick}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200 shadow-sm group/heart focus:outline-none"
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart
                className={`w-5 h-5 transition-colors duration-200 ${liked
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600 group-hover/heart:text-red-500'
                    }`}
            />
        </button>
    )
}
