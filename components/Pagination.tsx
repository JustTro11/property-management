'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/lib/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface PaginationProps {
    totalPages: number
    currentPage: number
    totalItems: number
    itemsPerPage: number
}

export default function Pagination({ totalPages, currentPage, totalItems, itemsPerPage }: PaginationProps) {
    const t = useTranslations('Pagination')
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    if (totalPages <= 1) return null

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 py-6 border-t border-zinc-800">
            <div className="text-zinc-400 text-sm">
                {t('showing', { start: startItem, end: endItem, total: totalItems })}
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
                    className={`p-2 rounded-lg border border-zinc-800 transition-colors ${currentPage > 1
                        ? 'text-white hover:bg-zinc-800 hover:border-zinc-700'
                        : 'text-zinc-600 cursor-not-allowed'
                        }`}
                    aria-disabled={currentPage <= 1}
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="sr-only">{t('previous')}</span>
                </Link>

                <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Link
                            key={page}
                            href={createPageURL(page)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${currentPage === page
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            {page}
                        </Link>
                    ))}
                </div>

                <Link
                    href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
                    className={`p-2 rounded-lg border border-zinc-800 transition-colors ${currentPage < totalPages
                        ? 'text-white hover:bg-zinc-800 hover:border-zinc-700'
                        : 'text-zinc-600 cursor-not-allowed'
                        }`}
                    aria-disabled={currentPage >= totalPages}
                >
                    <ChevronRight className="w-5 h-5" />
                    <span className="sr-only">{t('next')}</span>
                </Link>
            </div>
        </div>
    )
}
