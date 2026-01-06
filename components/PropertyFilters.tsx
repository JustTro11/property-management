'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/lib/navigation'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, ChevronDown, DollarSign } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

export default function PropertyFilters() {
    const t = useTranslations('PropertyFilters')
    const tStatus = useTranslations('PropertyDetails.status')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // State
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '')
    const [debouncedSearch] = useDebounce(searchTerm, 300)
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
    const [beds, setBeds] = useState(searchParams.get('beds') || '')
    const [status, setStatus] = useState(searchParams.get('status') || '')
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    // Sync URL with state
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (debouncedSearch) params.set('query', debouncedSearch)
        else params.delete('query')

        if (minPrice) params.set('minPrice', minPrice)
        else params.delete('minPrice')

        if (maxPrice) params.set('maxPrice', maxPrice)
        else params.delete('maxPrice')

        if (beds) params.set('beds', beds)
        else params.delete('beds')

        if (status) params.set('status', status)
        else params.delete('status')

        // Reset page on filter change
        params.set('page', '1')

        router.push(`${pathname}?${params.toString()}`)
    }, [debouncedSearch, minPrice, maxPrice, beds, status, pathname, router])

    const clearFilters = () => {
        setSearchTerm('')
        setMinPrice('')
        setMaxPrice('')
        setBeds('')
        setStatus('')
    }

    const hasActiveFilters = minPrice || maxPrice || beds || status

    const bedroomOptions = ['', '1', '2', '3', '4', '5']
    const statusOptions = [
        { value: '', label: t('anyStatus') },
        { value: 'available', label: tStatus('available') },
        { value: 'rented', label: tStatus('rented') },
        { value: 'maintenance', label: tStatus('maintenance') },
    ]

    return (
        <div className="mb-10 space-y-6">
            {/* Search Bar & Mobile Filter Toggle */}
            <div className="flex gap-4">
                <div className="relative flex-1 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="relative w-full bg-white dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-text-primary dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                    />
                </div>
                <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={`lg:hidden p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${hasActiveFilters
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-500 dark:text-indigo-400 shadow-lg shadow-indigo-500/20'
                        : 'bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                >
                    <SlidersHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Filters Area */}
            <div className={`bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 space-y-6 ${isFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto] gap-6">
                    {/* Price Range */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <DollarSign className="w-3.5 h-3.5" />
                            {t('priceRange')}
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-sm">$</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl pl-7 pr-3 py-2.5 text-text-primary dark:text-white text-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <span className="self-center text-zinc-400 dark:text-zinc-600">–</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-sm">$</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl pl-7 pr-3 py-2.5 text-text-primary dark:text-white text-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bedrooms - Pill Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            {t('bedrooms')}
                        </label>
                        <div className="flex gap-2">
                            {bedroomOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setBeds(option)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${beds === option
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                                        : 'bg-white dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-white'
                                        }`}
                                >
                                    {option === '' ? t('anyBeds') : `${option}+`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status - Custom Dropdown */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            {t('status')}
                        </label>
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full appearance-none bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 pr-10 text-text-primary dark:text-white text-sm cursor-pointer focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="bg-white dark:bg-zinc-900">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="group w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/30 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300"
                            >
                                <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
                                {t('clear')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Active Filter Tags */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
                        {minPrice && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs">
                                Min: ${minPrice}
                                <button onClick={() => setMinPrice('')} className="hover:text-indigo-800 dark:hover:text-white">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {maxPrice && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs">
                                Max: ${maxPrice}
                                <button onClick={() => setMaxPrice('')} className="hover:text-indigo-800 dark:hover:text-white">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {beds && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs">
                                {beds}+ Beds
                                <button onClick={() => setBeds('')} className="hover:text-purple-800 dark:hover:text-white">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {status && (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${status === 'available'
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                                : status === 'maintenance'
                                    ? 'bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-300'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-300'
                                }`}>
                                {statusOptions.find(o => o.value === status)?.label}
                                <button onClick={() => setStatus('')} className="hover:text-zinc-800 dark:hover:text-white">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
