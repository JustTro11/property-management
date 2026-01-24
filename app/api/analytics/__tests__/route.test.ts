/**
 * @jest-environment node
 */

import { GET } from '../route'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { getAnalyticsSummary } from '@/lib/services/analyticsService'

// Mock the Supabase server client
jest.mock('@/lib/supabaseServer', () => ({
    createClient: jest.fn()
}))

// Mock analytics service
jest.mock('@/lib/services/analyticsService', () => ({
    getAnalyticsSummary: jest.fn()
}))

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockGetAnalyticsSummary = getAnalyticsSummary as jest.MockedFunction<typeof getAnalyticsSummary>

describe('GET /api/analytics', () => {
    beforeEach(() => {
        jest.clearAllMocks()

        // Default: authenticated user
        mockCreateClient.mockResolvedValue({
            auth: {
                getSession: jest.fn().mockResolvedValue({
                    data: { session: { user: { id: 'test-user' } } }
                })
            }
        } as any)

        // Default analytics response
        mockGetAnalyticsSummary.mockResolvedValue({
            totalViews: 100,
            totalFavorites: 50,
            totalInquiries: 25,
            topProperties: [],
            viewsByDate: []
        })
    })

    it('returns analytics summary with default date range', async () => {
        const request = new NextRequest('http://localhost/api/analytics')
        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toHaveProperty('totalViews')
        expect(data.totalViews).toBe(100)
    })

    it('accepts start and end query parameters', async () => {
        const request = new NextRequest(
            'http://localhost/api/analytics?start=2026-01-01&end=2026-01-07'
        )
        const response = await GET(request)

        expect(response.status).toBe(200)
        expect(mockGetAnalyticsSummary).toHaveBeenCalledWith(
            expect.any(Date),
            expect.any(Date),
            false
        )
    })

    it('handles preset parameter for 7d', async () => {
        const request = new NextRequest('http://localhost/api/analytics?preset=7d')
        const response = await GET(request)

        expect(response.status).toBe(200)
        expect(mockGetAnalyticsSummary).toHaveBeenCalled()
    })

    it('handles preset parameter for all time', async () => {
        const request = new NextRequest('http://localhost/api/analytics?preset=all')
        const response = await GET(request)

        expect(response.status).toBe(200)
        expect(mockGetAnalyticsSummary).toHaveBeenCalledWith(
            undefined,
            expect.any(Date),
            true
        )
    })

    it('returns 401 when not authenticated', async () => {
        mockCreateClient.mockResolvedValueOnce({
            auth: {
                getSession: jest.fn().mockResolvedValue({ data: { session: null } })
            }
        } as any)

        const request = new NextRequest('http://localhost/api/analytics')
        const response = await GET(request)

        expect(response.status).toBe(401)
    })

    it('returns 400 for invalid date format', async () => {
        const request = new NextRequest(
            'http://localhost/api/analytics?start=invalid&end=also-invalid'
        )
        const response = await GET(request)

        expect(response.status).toBe(400)
    })
})
