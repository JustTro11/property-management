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

// Mock Supabase
const mockFrom = jest.fn()
const mockSelect = jest.fn()
const mockIn = jest.fn()

jest.mock('@/lib/supabaseClient', () => ({
    supabase: {
        from: (...args: any[]) => {
            mockFrom(...args)
            return {
                select: (...args: any[]) => {
                    mockSelect(...args)
                    return {
                        in: mockIn
                    }
                }
            }
        }
    }
}))

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
        mockFrom.mockClear()
        mockSelect.mockClear()
        mockIn.mockClear()

        // Default mock implementation for success
        mockIn.mockResolvedValue({
            data: [],
            error: null
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
                id: '12345678-1234-1234-1234-1234567890ab',
                title: 'Test Property',
                price: 500000,
                image_url: 'http://test.com/image.jpg',
                images: [],
                status: 'available'
            }
        ]

        // Setup local storage with valid UUID
        localStorageMock.setItem('recently_viewed', JSON.stringify(['12345678-1234-1234-1234-1234567890ab']))

        // Setup Supabase response
        mockIn.mockResolvedValue({
            data: mockProperties,
            error: null
        })

        await act(async () => {
            render(<RecentlyViewed currentPropertyId="other-id" />)
        })

        await waitFor(() => {
            expect(screen.getByText('Recently Viewed')).toBeInTheDocument()
            expect(screen.getByText('Test Property')).toBeInTheDocument()
        })

        expect(mockFrom).toHaveBeenCalledWith('properties')
        expect(mockIn).toHaveBeenCalledWith('id', ['12345678-1234-1234-1234-1234567890ab'])
    })

    it('filters out current property from view', async () => {
        const currentId = '12345678-1234-1234-1234-1234567890ab'
        localStorageMock.setItem('recently_viewed', JSON.stringify([currentId]))

        await act(async () => {
            render(<RecentlyViewed currentPropertyId={currentId} />)
        })

        await waitFor(() => {
            const heading = screen.queryByText('Recently Viewed')
            expect(heading).not.toBeInTheDocument()
        })

        // Should NOT call supabase if filtered list is empty
        expect(mockFrom).not.toHaveBeenCalled()
    })

    it('ignores invalid IDs in local storage', async () => {
        localStorageMock.setItem('recently_viewed', JSON.stringify(['invalid-id', '123']))

        // We can just render, no act needed if we just wait
        render(<RecentlyViewed currentPropertyId="other-id" />)

        await waitFor(() => {
            const heading = screen.queryByText('Recently Viewed')
            expect(heading).not.toBeInTheDocument()
        })

        // Should not verify against DB
        expect(mockFrom).not.toHaveBeenCalled()
    })
})
