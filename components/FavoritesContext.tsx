'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FavoritesContextType {
    favorites: string[]
    toggleFavorite: (propertyId: string) => void
    isFavorite: (propertyId: string) => boolean
    isLoaded: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('property_favorites')
            if (stored) {
                setFavorites(JSON.parse(stored))
            }
        } catch (e) {
            console.error('Failed to load favorites', e)
        }
        setIsLoaded(true)
    }, [])

    // Sync to localStorage whenever favorites change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('property_favorites', JSON.stringify(favorites))
        }
    }, [favorites, isLoaded])

    const toggleFavorite = (propertyId: string) => {
        if (!favorites.includes(propertyId)) {
            // Track favorite event
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    property_id: propertyId,
                    event_type: 'favorite'
                })
            }).catch(e => console.error('Failed to track favorite', e))
        }

        setFavorites(prev => {
            if (prev.includes(propertyId)) {
                return prev.filter(id => id !== propertyId)
            } else {
                return [...prev, propertyId]
            }
        })
    }

    const isFavorite = (propertyId: string) => favorites.includes(propertyId)

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, isLoaded }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext)
    if (context === undefined) {
        throw new Error('useFavoritesContext must be used within a FavoritesProvider')
    }
    return context
}
