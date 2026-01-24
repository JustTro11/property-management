import { getProperties, getPropertyById } from '../propertyService'
import { MOCK_PROPERTIES } from '@/lib/mockData'

// Mock the environment to force mock data usage
jest.mock('@/lib/env', () => ({
    getSupabaseConfig: () => null
}))

// Mock Supabase client to simulate failure/environment mismatch
jest.mock('@/lib/supabaseServer', () => ({
    createClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Supabase not configured') })
    })
}))

describe('propertyService (Mock Mode)', () => {

    beforeAll(() => {
        // Ensure we are in mock mode by setting env var if needed, or relying on our mocks
        process.env.NEXT_PUBLIC_FORCE_MOCK_DATA = 'true'
    })

    describe('getProperties', () => {
        it('should return all mock properties when no filters are applied', async () => {
            const { properties, total } = await getProperties({ limit: 100 })
            expect(total).toBe(MOCK_PROPERTIES.length)
            expect(properties.length).toBe(MOCK_PROPERTIES.length)
        })

        it('should filter by minPrice', async () => {
            const min = 4000
            const { properties } = await getProperties({ minPrice: min, limit: 100 })
            properties.forEach(p => {
                expect(p.price).toBeGreaterThanOrEqual(min)
            })
        })

        it('should filter by maxPrice', async () => {
            const max = 3000
            const { properties } = await getProperties({ maxPrice: max, limit: 100 })
            properties.forEach(p => {
                expect(p.price).toBeLessThanOrEqual(max)
            })
        })

        it('should filter by bedrooms', async () => {
            const beds = 3
            const { properties } = await getProperties({ beds, limit: 100 })
            properties.forEach(p => {
                expect(p.bedrooms).toBeGreaterThanOrEqual(beds)
            })
        })

        it('should search by title or address', async () => {
            const query = 'Loft'
            const { properties } = await getProperties({ query, limit: 100 })
            properties.forEach(p => {
                const titleMatch = p.title.toLowerCase().includes(query.toLowerCase())
                const addrMatch = p.address.toLowerCase().includes(query.toLowerCase())
                expect(titleMatch || addrMatch).toBe(true)
            })
        })

        it('should filter by amenities', async () => {
            const amenity = 'Pool'
            const { properties } = await getProperties({ amenities: [amenity], limit: 100 })
            properties.forEach(p => {
                expect(p.amenities).toContain(amenity)
            })
        })
    })

    describe('getPropertyById', () => {
        it('should return the correct property for a valid ID', async () => {
            const target = MOCK_PROPERTIES[0]
            const result = await getPropertyById(target.id)
            expect(result).not.toBeNull()
            expect(result?.id).toBe(target.id)
        })

        it('should return null for an invalid ID', async () => {
            const result = await getPropertyById('non-existent-id')
            expect(result).toBeNull()
        })
    })
})
