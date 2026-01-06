'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import BookTourModal from './BookTourModal'
import { useTranslations } from 'next-intl'

interface PropertyActionsProps {
    title: string
    price: number
    isAvailable: boolean
}

export default function PropertyActions({ title, price, isAvailable }: PropertyActionsProps) {
    const t = useTranslations('PropertyDetails')
    const [isTourModalOpen, setIsTourModalOpen] = useState(false)
    const [showCopiedToast, setShowCopiedToast] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
        setShowCopiedToast(true)
        setTimeout(() => setShowCopiedToast(false), 2000)
    }

    const handleShare = () => {
        copyToClipboard()
    }

    return (
        <>
            <div className="flex gap-3 relative">
                <button
                    onClick={handleShare}
                    className="p-3 rounded-full border border-border-color dark:border-zinc-700 text-text-muted dark:text-zinc-400 hover:text-text-primary dark:hover:text-white hover:border-indigo-500/50 dark:hover:border-zinc-500 transition-colors group relative"
                    title={t('share')}
                >
                    {showCopiedToast ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}

                    {/* Tooltip/Toast for Copy Feedback */}
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-bg-tertiary dark:bg-zinc-800 text-text-primary dark:text-white text-xs rounded-md whitespace-nowrap border border-border-color dark:border-zinc-700 pointer-events-none transition-all duration-200 ${showCopiedToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        {t('linkCopied')}
                    </div>
                </button>

                <button
                    onClick={() => setIsTourModalOpen(true)}
                    disabled={!isAvailable}
                    className={`px-8 py-3 rounded-full font-semibold transition-all shadow-lg transform ${isAvailable
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20 active:scale-95'
                        : 'bg-bg-tertiary dark:bg-zinc-800 text-text-muted dark:text-zinc-500 cursor-not-allowed border border-border-color dark:border-zinc-700'
                        }`}
                >
                    {isAvailable ? t('bookTour') : t('unavailable')}
                </button>
            </div>

            <BookTourModal
                isOpen={isTourModalOpen}
                onClose={() => setIsTourModalOpen(false)}
                propertyTitle={title}
            />
        </>
    )
}
