import { getProperties, getPropertyById } from '../propertyService'
import { MOCK_PROPERTIES } from '@/lib/mockData'

// Mock environment to enable Supabase path
jest.mock('@/lib/env', () => ({
    getSupabaseConfig: () => ({ url: 'https://fake.supabase.com', key: 'fake-key' })
}))

// Mock console.error to keep output clean during expected error tests
const originalError = console.error
beforeAll(() => { console.error = jest.fn() })
afterAll(() => { console.error = originalError })

// Setup Mocks
const mockReturnThis = jest.fn()
const mockRange = jest.fn()
const mockSingle = jest.fn()

// Chainable builder mock
const mockBuilder = {
    select: mockReturnThis,
    or: mockReturnThis,
    gte: mockReturnThis,
    lte: mockReturnThis,
    eq: mockReturnThis,
    contains: mockReturnThis,
    order: mockReturnThis,
    range: mockRange,
    single: mockSingle
}

// Ensure methods return the builder itself to support chaining
mockReturnThis.mockReturnValue(mockBuilder)

jest.mock('@/lib/supabaseServer', () => ({
    createClient: jest.fn(() => Promise.resolve({
        from: jest.fn(() => mockBuilder)
    }))
}))

describe('propertyService (Supabase Mode)', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...OLD_ENV }
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://valid-url.supabase.co'
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-key'
        process.env.NEXT_PUBLIC_FORCE_MOCK_DATA = 'false'

        jest.clearAllMocks()
        // Default Success Response for Range (getProperties)
        mockRange.mockResolvedValue({
            data: [{ id: 'supa-1', title: 'Supa Prop' }],
            count: 1,
            error: null
        })
        // Default Success Response for Single (getPropertyById)
        mockSingle.mockResolvedValue({
            data: { id: 'supa-1', title: 'Supa Prop' },
            error: null
        })

        // Ensure builder methods return the builder
        mockReturnThis.mockReturnValue(mockBuilder)
    })

    afterAll(() => {
        process.env = OLD_ENV
    })

    describe('getProperties', () => {
        it('should fetch properties from Supabase when configured', async () => {
            const { properties, total } = await getProperties()

            expect(properties).toHaveLength(1)
            expect(properties[0].title).toBe('Supa Prop')
            expect(total).toBe(1)
            expect(mockRange).toHaveBeenCalled()
        })

        it('should apply search query filter', async () => {
            await getProperties({ query: 'Modern' })
            expect(mockBuilder.or).toHaveBeenCalledWith(expect.stringContaining('Modern'))
        })

        it('should apply price filters', async () => {
            await getProperties({ minPrice: 100, maxPrice: 500 })
            expect(mockBuilder.gte).toHaveBeenCalledWith('price', 100)
            expect(mockBuilder.lte).toHaveBeenCalledWith('price', 500)
        })

        it('should apply bedroom filter', async () => {
            await getProperties({ beds: 2 })
            expect(mockBuilder.gte).toHaveBeenCalledWith('bedrooms', 2)
        })

        it('should apply status filter', async () => {
            await getProperties({ status: 'rented' })
            expect(mockBuilder.eq).toHaveBeenCalledWith('status', 'rented')
        })

        it('should apply amenities filter', async () => {
            await getProperties({ amenities: ['Pool'] })
            expect(mockBuilder.contains).toHaveBeenCalledWith('amenities', ['Pool'])
        })

        it('should handle null data from Supabase gracefully', async () => {
            mockRange.mockResolvedValue({ data: null, count: 0, error: null })
            const { properties } = await getProperties()
            expect(properties).toEqual([])
        })

        it('should fallback to mock data on Supabase error', async () => {
            // Simulate error
            mockRange.mockResolvedValue({ data: null, count: null, error: { message: 'DB Disconnected' } })

            const { properties, total } = await getProperties()

            // Should return MOCK_PROPERTIES
            expect(total).toBe(MOCK_PROPERTIES.length)
            expect(properties.length).toBeGreaterThan(0)
            expect(properties[0].id).not.toBe('supa-1')
        })
    })

    describe('getPropertyById', () => {
        it('should fetch property from Supabase', async () => {
            const prop = await getPropertyById('supa-1')
            expect(prop).not.toBeNull()
            expect(prop?.title).toBe('Supa Prop')
        })

        it('should fallback to mock data on Supabase error', async () => {
            // Simulate error
            mockSingle.mockRejectedValue(new Error('Fetch failed'))

            // Use a known mock ID
            const mockId = MOCK_PROPERTIES[0].id
            const prop = await getPropertyById(mockId)

            expect(prop).not.toBeNull()
            expect(prop?.id).toBe(mockId)
        })
    })
})
