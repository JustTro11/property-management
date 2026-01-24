'use client'

import { useEffect, useRef } from 'react'

export default function AnalyticsTracker({ propertyId }: { propertyId: string }) {
    const hasTracked = useRef(false)

    useEffect(() => {
        if (hasTracked.current) return
        hasTracked.current = true

        const trackView = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        property_id: propertyId,
                        event_type: 'view'
                    })
                })
            } catch (e) {
                console.error('Failed to track view', e)
            }
        }

        trackView()
    }, [propertyId])

    return null
}
