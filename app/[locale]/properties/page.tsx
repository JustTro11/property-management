import PropertiesContent from '@/components/PropertiesContent'
import PropertyFilters from '@/components/PropertyFilters'
import Pagination from '@/components/Pagination'
import { getProperties } from '@/lib/services/propertyService'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

interface PropertiesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
    const t = await getTranslations('PropertiesPage')
    // const supabase = await createClient() // Removed
    const resolvedSearchParams = await searchParams

    // Parse Search Params
    const query = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : undefined
    const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? parseInt(resolvedSearchParams.minPrice) : undefined
    const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? parseInt(resolvedSearchParams.maxPrice) : undefined
    const beds = typeof resolvedSearchParams.beds === 'string' ? parseInt(resolvedSearchParams.beds) : undefined
    const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined
    const amenitiesParam = typeof resolvedSearchParams.amenities === 'string' ? resolvedSearchParams.amenities : undefined
    const amenities = amenitiesParam ? amenitiesParam.split(',') : []
    const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1

    const itemsPerPage = 6
    const startRange = (page - 1) * itemsPerPage
    const endRange = startRange + itemsPerPage - 1

    const { properties, total: totalItems } = await getProperties({
        query,
        minPrice,
        maxPrice,
        beds,
        status,
        amenities,
        page,
        limit: itemsPerPage
    })

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

                <PropertiesContent properties={properties} />

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
