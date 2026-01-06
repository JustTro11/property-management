import PropertyCard from '@/components/PropertyCard'
import PropertyFilters from '@/components/PropertyFilters'
import Pagination from '@/components/Pagination'
import { createClient } from '@/lib/supabaseServer'
import { getTranslations } from 'next-intl/server'
import { Property } from '@/types'

// Mock data (shared with home page for now)
const MOCK_PROPERTIES = [
    {
        id: '1',
        title: "Modern Downtown Loft",
        price: 3500,
        address: "123 Main St, City Center",
        image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop",
        sqft: 1200,
        bedrooms: 2,
        bathrooms: 2,
        status: 'available' as const
    },
    {
        id: '2',
        title: "Secluded Hilltop Villa",
        price: 5200,
        address: "45 Skyline Dr, Beverly Hills",
        image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop",
        sqft: 2800,
        bedrooms: 4,
        bathrooms: 3,
        status: 'available' as const
    },
    {
        id: '3',
        title: "Oceanfront Glass Home",
        price: 8500,
        address: "789 Pacific Coast Hwy, Malibu",
        image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop",
        sqft: 3500,
        bedrooms: 3,
        bathrooms: 4,
        status: 'rented' as const
    },
    {
        id: '4',
        title: "Eco-Friendly Forest Cabin",
        price: 2800,
        address: "88 Pine Cone Way, Portland",
        image_url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop",
        sqft: 950,
        bedrooms: 2,
        bathrooms: 1,
        status: 'maintenance' as const
    }
]

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
        // Fallback (search is not supported in fallback)
        properties = MOCK_PROPERTIES as unknown as Property[]
        totalItems = MOCK_PROPERTIES.length
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return (
        <main className="min-h-screen bg-black pt-32 pb-12 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        {t('title')} <span className="text-indigo-500">{t('highlight')}</span>
                    </h1>
                    <p className="mt-4 text-lg text-zinc-400">
                        {t('subtitle')}
                    </p>
                </div>

                <PropertyFilters />

                {properties.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                        <p className="text-zinc-400 text-lg">No properties found matching your criteria.</p>
                        {query || minPrice || maxPrice || beds || status ? (
                            <p className="text-zinc-500 mt-2 text-sm">Try adjusting your filters.</p>
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
