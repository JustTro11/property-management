import { getAnalyticsSummary } from '../analyticsService'

// Mock the Supabase server client
const mockSelect = jest.fn()
const mockFrom = jest.fn(() => ({
    select: mockSelect
}))

jest.mock('@/lib/supabaseServer', () => ({
    createClient: jest.fn(() => Promise.resolve({
        from: mockFrom
    }))
}))

describe('getAnalyticsSummary', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        // Default mock: return empty data
        mockSelect.mockReturnValue({
            gte: jest.fn().mockReturnValue({
                lte: jest.fn().mockResolvedValue({ data: [], error: null }),
                then: jest.fn().mockResolvedValue({ data: [], error: null })
            })
        })
    })

    describe('with date range parameters', () => {
        it('defaults to last 30 days when no dates provided', async () => {
            const mockData = [
                { event_type: 'view', created_at: new Date().toISOString(), property_id: '1', properties: { title: 'Test' } }
            ]
            mockSelect.mockReturnValue({
                gte: jest.fn().mockReturnValue({
                    lte: jest.fn().mockResolvedValue({ data: mockData, error: null })
                })
            })

            const summary = await getAnalyticsSummary()

            expect(summary).toHaveProperty('totalViews')
            expect(summary).toHaveProperty('viewsByDate')
            expect(summary.viewsByDate.length).toBe(31)
        })

        it('accepts startDate and endDate parameters', async () => {
            const startDate = new Date('2026-01-01')
            const endDate = new Date('2026-01-07')

            const mockData = [
                { event_type: 'view', created_at: '2026-01-02T10:00:00Z', property_id: '1', properties: { title: 'Test' } },
                { event_type: 'view', created_at: '2026-01-03T10:00:00Z', property_id: '1', properties: { title: 'Test' } }
            ]
            mockSelect.mockReturnValue({
                gte: jest.fn().mockReturnValue({
                    lte: jest.fn().mockResolvedValue({ data: mockData, error: null })
                })
            })

            const summary = await getAnalyticsSummary(startDate, endDate)

            expect(summary).toHaveProperty('totalViews')
            expect(summary.totalViews).toBe(2)
            // 7 days from Jan 1 to Jan 7 inclusive
            expect(summary.viewsByDate.length).toBe(7)
        })

        it('handles "All Time" when allTime flag is true', async () => {
            const mockData = [
                { event_type: 'view', created_at: '2024-01-01T10:00:00Z', property_id: '1', properties: { title: 'Test' } },
                { event_type: 'favorite', created_at: '2025-06-15T10:00:00Z', property_id: '2', properties: { title: 'Test 2' } }
            ]
            mockSelect.mockReturnValue({
                gte: jest.fn().mockResolvedValue({ data: mockData, error: null })
            })

            const summary = await getAnalyticsSummary(undefined, undefined, true)

            expect(summary).toHaveProperty('totalViews')
            expect(summary.totalViews).toBe(1)
            expect(summary.totalFavorites).toBe(1)
        })

        it('correctly counts different event types', async () => {
            const mockData = [
                { event_type: 'view', created_at: new Date().toISOString(), property_id: '1', properties: { title: 'Test' } },
                { event_type: 'view', created_at: new Date().toISOString(), property_id: '1', properties: { title: 'Test' } },
                { event_type: 'favorite', created_at: new Date().toISOString(), property_id: '1', properties: { title: 'Test' } },
                { event_type: 'inquiry', created_at: new Date().toISOString(), property_id: '1', properties: { title: 'Test' } },
                { event_type: 'inquiry', created_at: new Date().toISOString(), property_id: '2', properties: { title: 'Test 2' } },
                { event_type: 'inquiry', created_at: new Date().toISOString(), property_id: '2', properties: { title: 'Test 2' } }
            ]
            mockSelect.mockReturnValue({
                gte: jest.fn().mockReturnValue({
                    lte: jest.fn().mockResolvedValue({ data: mockData, error: null })
                })
            })

            const summary = await getAnalyticsSummary()

            expect(summary.totalViews).toBe(2)
            expect(summary.totalFavorites).toBe(1)
            expect(summary.totalInquiries).toBe(3)
        })

        it('correctly identifies top properties by views', async () => {
            const mockData = [
                { event_type: 'view', created_at: new Date().toISOString(), property_id: '1', properties: { title: 'Property A' } },
                { event_type: 'view', created_at: new Date().toISOString(), property_id: '1', properties: { title: 'Property A' } },
                { event_type: 'view', created_at: new Date().toISOString(), property_id: '1', properties: { title: 'Property A' } },
                { event_type: 'view', created_at: new Date().toISOString(), property_id: '2', properties: { title: 'Property B' } },
                { event_type: 'view', created_at: new Date().toISOString(), property_id: '2', properties: { title: 'Property B' } }
            ]
            mockSelect.mockReturnValue({
                gte: jest.fn().mockReturnValue({
                    lte: jest.fn().mockResolvedValue({ data: mockData, error: null })
                })
            })

            const summary = await getAnalyticsSummary()

            expect(summary.topProperties.length).toBe(2)
            expect(summary.topProperties[0].title).toBe('Property A')
            expect(summary.topProperties[0].views).toBe(3)
            expect(summary.topProperties[1].title).toBe('Property B')
            expect(summary.topProperties[1].views).toBe(2)
        })
    })
})
