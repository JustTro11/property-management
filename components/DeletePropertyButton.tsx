'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from '@/lib/navigation'

interface DeletePropertyButtonProps {
    propertyId: string
    propertyTitle: string
}

export default function DeletePropertyButton({ propertyId, propertyTitle }: DeletePropertyButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        const confirmed = window.confirm(`Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`)

        if (!confirmed) return

        setIsDeleting(true)

        try {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', propertyId)

            if (error) throw error

            router.refresh()
        } catch (error) {
            console.error('Error deleting property:', error)
            alert('Failed to delete property. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center p-2 border border-red-200 dark:border-red-900/30 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Delete ${propertyTitle}`}
        >
            {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </button>
    )
}
