'use client'

import { useEffect } from 'react'

export default function ViewTracker({ propertyId }: { propertyId: string }) {
    useEffect(() => {
        const stored = localStorage.getItem('recently_viewed')
        let viewed: string[] = stored ? JSON.parse(stored) : []

        // Remove if exists (to move to front)
        viewed = viewed.filter(id => id !== propertyId)

        // Add to front
        viewed.unshift(propertyId)

        // Limit to 5
        if (viewed.length > 5) {
            viewed = viewed.slice(0, 5)
        }

        localStorage.setItem('recently_viewed', JSON.stringify(viewed))
    }, [propertyId])

    return null
}
