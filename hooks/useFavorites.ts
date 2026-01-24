'use client'

import { useState, useEffect } from 'react'

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem('property_favorites')
        if (stored) {
            try {
                setFavorites(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to parse favorites', e)
            }
        }
        setIsLoaded(true)
    }, [])

    const toggleFavorite = (propertyId: string) => {
        setFavorites(prev => {
            let newFavorites
            if (prev.includes(propertyId)) {
                newFavorites = prev.filter(id => id !== propertyId)
            } else {
                newFavorites = [...prev, propertyId]
            }
            localStorage.setItem('property_favorites', JSON.stringify(newFavorites))
            return newFavorites
        })
    }

    const isFavorite = (propertyId: string) => favorites.includes(propertyId)

    return { favorites, toggleFavorite, isFavorite, isLoaded }
}
