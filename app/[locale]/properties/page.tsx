import PropertyCard from '@/components/PropertyCard'
import PropertyFilters from '@/components/PropertyFilters'
import Pagination from '@/components/Pagination'
import { createClient } from '@/lib/supabaseServer'
import { getTranslations } from 'next-intl/server'
import { Property } from '@/types'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

import { MOCK_PROPERTIES } from '@/lib/mockData'

interface PropertiesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
    const t = await getTranslations('PropertiesPage')
    const supabase = await createClient()
    const resolvedSearchParams = await searchParams

    // Parse Search Params
    const query = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : ''
    const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? parseInt(resolvedSearchParams.minPrice) : null
    const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? parseInt(resolvedSearchParams.maxPrice) : null
    const beds = typeof resolvedSearchParams.beds === 'string' ? parseInt(resolvedSearchParams.beds) : null
    const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : null
    const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1

    const itemsPerPage = 6
    const startRange = (page - 1) * itemsPerPage
    const endRange = startRange + itemsPerPage - 1

    let properties: Property[] = []
    let totalItems = 0

    // Check if Supabase is configured
    const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
        process.env.NEXT_PUBLIC_FORCE_MOCK_DATA?.trim() !== 'true';

    if (isSupabaseConfigured) {
        try {
            let dbQuery = supabase
                .from('properties')
                .select('*', { count: 'exact' })

            // Apply Filters
            if (query) {
                dbQuery = dbQuery.or(`title.ilike.%${query}%,address.ilike.%${query}%`)
            }
            if (minPrice) {
                dbQuery = dbQuery.gte('price', minPrice)
            }
            if (maxPrice) {
                dbQuery = dbQuery.lte('price', maxPrice)
            }
            if (beds) {
                dbQuery = dbQuery.gte('bedrooms', beds)
            }
            if (status) {
                dbQuery = dbQuery.eq('status', status)
            }

            // Apply Custom Sort (Available -> Maintenance -> Rented)
            // Note: Complex custom sorting is hard in raw SQL/Supabase without a computed column.
            // For simplicity with pagination, we will use standard sorting (created_at) OR fetch all and sort in memory if the dataset is small.
            // Since we need pagination on the DB side for performance, implementing complex custom sort via SQL is tricky without stored procedures or custom types.
            // However, for this task, let's prioritize correct Filtering and Pagination over the specific custom sort *if* they conflict.
            // But we can try to chain .order(). Ideally we want: status=available (1), status=maintenance (2), status=rented (3).
            // Since 'available' < 'maintenance' < 'rented' alphabetically: 'available' overlaps.
            // Alphabetical: available, maintenance, rented. This coincidentally matches our desired order!
            // So we can just order by status ascending.

            dbQuery = dbQuery
                .order('status', { ascending: true })
                .order('created_at', { ascending: false })
                .range(startRange, endRange)

            const { data, count, error } = await dbQuery

            if (error) {
                console.error('Supabase error:', error)
                throw error
            }

            properties = data as Property[] || []
            totalItems = count || 0

        } catch (e) {
            console.error('Error fetching properties:', e)
            // Fallback with in-memory filtering
            let filtered = MOCK_PROPERTIES as unknown as Property[]

            if (query) {
                const q = query.toLowerCase()
                filtered = filtered.filter(p =>
                    p.title.toLowerCase().includes(q) ||
                    p.address.toLowerCase().includes(q)
                )
            }
            if (minPrice) {
                filtered = filtered.filter(p => p.price >= minPrice)
            }
            if (maxPrice) {
                filtered = filtered.filter(p => p.price <= maxPrice)
            }
            if (beds) {
                filtered = filtered.filter(p => p.bedrooms >= beds)
            }
            if (status) {
                filtered = filtered.filter(p => p.status === status)
            }

            totalItems = filtered.length
            // Apply pagination in memory
            properties = filtered.slice(startRange, endRange + 1)
            console.error('DEBUG: Mock Filter Result Count:', filtered.length)
        }
    } else {
        console.error('DEBUG: Using Mock Data Fallback')
        // Fallback for when Supabase is not configured (avoid DNS errors)
        let filtered = MOCK_PROPERTIES as unknown as Property[]

        if (query) {
            const q = query.toLowerCase()
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.address.toLowerCase().includes(q)
            )
        }
        if (minPrice) {
            filtered = filtered.filter(p => p.price >= minPrice)
        }
        if (maxPrice) {
            filtered = filtered.filter(p => p.price <= maxPrice)
        }
        if (beds) {
            filtered = filtered.filter(p => p.bedrooms >= beds)
        }
        if (status) {
            filtered = filtered.filter(p => p.status === status)
        }

        totalItems = filtered.length
        properties = filtered.slice(startRange, endRange + 1)
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return (
        <main className="min-h-screen bg-bg-primary dark:bg-black pt-32 pb-12 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-text-primary dark:text-white sm:text-5xl">
                        {t('title')} <span className="text-indigo-500">{t('highlight')}</span>
                    </h1>
                    <p className="mt-4 text-lg text-text-muted dark:text-zinc-400">
                        {t('subtitle')}
                    </p>
                </div>

                <Suspense fallback={<div>Loading filters...</div>}>
                    <PropertyFilters />
                </Suspense>

                {properties.length === 0 ? (
                    <div className="text-center py-20 bg-bg-secondary/50 dark:bg-zinc-900/50 rounded-2xl border border-border-color dark:border-zinc-800">
                        <p className="text-text-muted dark:text-zinc-400 text-lg">No properties found matching your criteria.</p>
                        {query || minPrice || maxPrice || beds || status ? (
                            <p className="text-text-muted dark:text-zinc-500 mt-2 text-sm">Try adjusting your filters.</p>
                        ) : null}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}

                <Pagination
                    totalPages={totalPages}
                    currentPage={page}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </main>
    )
}
