import { createClient } from '@/lib/supabaseServer'
import { MOCK_PROPERTIES } from '@/lib/mockData'
import { Property } from '@/types'

export interface PropertyFilters {
    query?: string
    minPrice?: number
    maxPrice?: number
    beds?: number
    status?: string
    amenities?: string[]
    page?: number
    limit?: number
}

const isSupabaseConfigured = () => {
    return !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
        process.env.NEXT_PUBLIC_FORCE_MOCK_DATA !== 'true';
}

export async function getProperties(filters: PropertyFilters = {}) {
    const {
        query,
        minPrice,
        maxPrice,
        beds,
        status,
        amenities,
        page = 1,
        limit = 12
    } = filters

    const startRange = (page - 1) * limit
    const endRange = startRange + limit - 1

    if (isSupabaseConfigured()) {
        const supabase = await createClient()
        try {
            let dbQuery = supabase
                .from('properties')
                .select('*', { count: 'exact' })

            if (query) {
                dbQuery = dbQuery.or(`title.ilike.%${query}%,address.ilike.%${query}%`)
            }
            if (minPrice) dbQuery = dbQuery.gte('price', minPrice)
            if (maxPrice) dbQuery = dbQuery.lte('price', maxPrice)
            if (beds) dbQuery = dbQuery.gte('bedrooms', beds)
            if (status) dbQuery = dbQuery.eq('status', status)
            if (amenities && amenities.length > 0) dbQuery = dbQuery.contains('amenities', amenities)

            dbQuery = dbQuery
                .order('status', { ascending: true })
                .order('created_at', { ascending: false })
                .range(startRange, endRange)

            const { data, count, error } = await dbQuery

            if (error) throw error

            return {
                properties: data as Property[] || [],
                total: count || 0
            }

        } catch (e) {
            console.error('Error fetching properties from Supabase:', e)
            // Fallback to mock
        }
    }

    // Mock Data Fallback
    // console.log('Using Mock Data')
    let filtered = MOCK_PROPERTIES as unknown as Property[]

    if (query) {
        const q = query.toLowerCase()
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q)
        )
    }
    if (minPrice) filtered = filtered.filter(p => p.price >= minPrice)
    if (maxPrice) filtered = filtered.filter(p => p.price <= maxPrice)
    if (beds) filtered = filtered.filter(p => p.bedrooms >= beds)
    if (status) filtered = filtered.filter(p => p.status === status)
    if (amenities && amenities.length > 0) {
        filtered = filtered.filter(p =>
            p.amenities && amenities.every(a => p.amenities!.includes(a))
        )
    }

    const total = filtered.length
    const properties = filtered.slice(startRange, endRange + 1)

    return { properties, total }
}

export async function getPropertyById(id: string): Promise<Property | null> {
    if (isSupabaseConfigured()) {
        const supabase = await createClient()
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', id)
                .single()

            if (data) return data as Property
        } catch (e) {
            console.error('Error fetching property from Supabase:', e)
        }
    }

    // Mock Fallback
    return (MOCK_PROPERTIES.find(p => p.id === id) as Property) || null
}

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
    if (ids.length === 0) return []

    if (isSupabaseConfigured()) {
        const supabase = await createClient()
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .in('id', ids)

            if (data) {
                // Maintain order based on input 'ids' array if possible, or client sorts.
                // SQL 'IN' does not guarantee order.
                // We'll return data and let caller sort if needed, or sort here.
                // Caller (RecentlyViewed) sorts it.
                return data as Property[]
            }
        } catch (e) {
            console.error('Error fetching properties by IDs from Supabase:', e)
        }
    }

    // Mock Fallback
    return MOCK_PROPERTIES.filter(p => ids.includes(p.id)) as unknown as Property[]
}
