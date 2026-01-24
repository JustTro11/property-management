import { render, screen, waitFor } from '@testing-library/react'
import RecentlyViewed from '../RecentlyViewed'
import { supabase } from '@/lib/supabaseClient'
import { act } from 'react'

// Mock Next Intl
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => {
        const messages: Record<string, string> = {
            title: 'Recently Viewed',
            perMonth: '/mo'
        }
        return messages[key] || key
    }
}))

// Mock global fetch
global.fetch = jest.fn() as jest.Mock

// Mock LocalStorage (unchanged)
const localStorageMock = (function () {
    let store: Record<string, string> = {}
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString()
        }),
        clear: jest.fn(() => {
            store = {}
        })
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

describe('RecentlyViewed', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        localStorageMock.clear()

            // Default mock implementation for fetch success (empty list)
            ; (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => []
            })
    })

    it('renders nothing if no recently viewed items', async () => {
        render(<RecentlyViewed currentPropertyId="current-id" />)
        // Should be empty/null initially or after effect
        await waitFor(() => {
            const heading = screen.queryByText('Recently Viewed')
            expect(heading).not.toBeInTheDocument()
        })
    })

    it('fetches and displays valid recent properties', async () => {
        const mockProperties = [
            {
                id: 'p1',
                title: 'Test Property',
                price: 500000,
                image_url: 'http://test.com/image.jpg',
                images: [],
                status: 'available'
            }
        ]

        // Setup local storage (simple IDs are fine now)
        localStorageMock.setItem('recently_viewed', JSON.stringify(['p1']))

            // Setup fetch response
            ; (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockProperties
            })

        await act(async () => {
            render(<RecentlyViewed currentPropertyId="other-id" />)
        })

        await waitFor(() => {
            expect(screen.getByText('Recently Viewed')).toBeInTheDocument()
            expect(screen.getByText('Test Property')).toBeInTheDocument()
        })

        expect(global.fetch).toHaveBeenCalledWith('/api/properties/batch', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ ids: ['p1'] })
        }))
    })

    it('filters out current property from view', async () => {
        const currentId = 'p1'
        localStorageMock.setItem('recently_viewed', JSON.stringify([currentId]))

        await act(async () => {
            render(<RecentlyViewed currentPropertyId={currentId} />)
        })

        await waitFor(() => {
            const heading = screen.queryByText('Recently Viewed')
            expect(heading).not.toBeInTheDocument()
        })

        // Should NOT call fetch if filtered list is empty
        expect(global.fetch).not.toHaveBeenCalled()
    })

    it('sends all other IDs to API', async () => {
        localStorageMock.setItem('recently_viewed', JSON.stringify(['invalid-id', '123']))

            // Mock empty response implies API handled it (by returning nothing found)
            ; (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => [] // API returns empty list for unknown IDs
            })

        render(<RecentlyViewed currentPropertyId="other-id" />)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/properties/batch', expect.objectContaining({
                body: JSON.stringify({ ids: ['invalid-id', '123'] })
            }))
        })
    })
})
