'use client'

import { useState } from 'react'
import { Home } from 'lucide-react'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1073&auto=format&fit=crop'

interface PropertyThumbnailProps {
    src: string | null | undefined
    alt: string
}

export default function PropertyThumbnail({ src, alt }: PropertyThumbnailProps) {
    const [imgError, setImgError] = useState(false)
    const [imgSrc, setImgSrc] = useState(src || '')

    const handleError = () => {
        if (!imgError) {
            setImgError(true)
            setImgSrc(FALLBACK_IMAGE)
        }
    }

    if (!src || imgError && imgSrc === FALLBACK_IMAGE) {
        // Show fallback image instead of icon when no src or after error with fallback
        if (imgError || !src) {
            return (
                <img
                    src={FALLBACK_IMAGE}
                    alt={alt}
                    className="h-full w-full object-cover"
                    onError={() => {
                        // If even fallback fails, show icon
                    }}
                />
            )
        }
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            className="h-full w-full object-cover"
            onError={handleError}
        />
    )
}
