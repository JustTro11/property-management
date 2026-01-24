import { renderHook, act } from '@testing-library/react'
import { FavoritesProvider, useFavoritesContext } from '@/components/FavoritesContext'
import { ReactNode } from 'react'

// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
    })
) as jest.Mock

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString()
        }),
        clear: jest.fn(() => {
            store = {}
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key]
        })
    }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('FavoritesContext', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        localStorageMock.clear()
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
        <FavoritesProvider>{children}</FavoritesProvider>
    )

    it('initializes with empty favorites', () => {
        const { result } = renderHook(() => useFavoritesContext(), { wrapper })
        expect(result.current.favorites).toEqual([])
        expect(result.current.isLoaded).toBe(true)
    })

    it('loads favorites from localStorage', () => {
        localStorageMock.setItem('property_favorites', JSON.stringify(['prop-1', 'prop-2']))
        const { result } = renderHook(() => useFavoritesContext(), { wrapper })

        expect(result.current.favorites).toEqual(['prop-1', 'prop-2'])
    })

    it('toggles favorites correctly', async () => {
        const { result } = renderHook(() => useFavoritesContext(), { wrapper })

        // Add
        await act(async () => {
            result.current.toggleFavorite('prop-1')
        })
        expect(result.current.favorites).toContain('prop-1')
        expect(result.current.isFavorite('prop-1')).toBe(true)
        expect(localStorageMock.setItem).toHaveBeenCalledWith('property_favorites', expect.stringContaining('prop-1'))

        // Verify analytics tracking on ADD
        expect(global.fetch).toHaveBeenCalledWith('/api/analytics/track', expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('favorite')
        }))

        // Remove
        await act(async () => {
            result.current.toggleFavorite('prop-1')
        })
        expect(result.current.favorites).not.toContain('prop-1')
        expect(result.current.isFavorite('prop-1')).toBe(false)
    })

    it('does not double track favorites', async () => {
        const { result } = renderHook(() => useFavoritesContext(), { wrapper })

        // Add once
        await act(async () => {
            result.current.toggleFavorite('prop-1')
        })

        // Try add again (should toggle off, not track add)
        await act(async () => {
            result.current.toggleFavorite('prop-1')
        })

        // Only one tracking call (for the first add)
        expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('handles localStorage errors gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })
            // Mock getItem to throw
            ; (localStorageMock.getItem as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Access denied')
            })

        const { result } = renderHook(() => useFavoritesContext(), { wrapper })

        expect(result.current.favorites).toEqual([])
        expect(consoleSpy).toHaveBeenCalledWith('Failed to load favorites:', expect.anything())

        consoleSpy.mockRestore()
    })

    it('throws error when used outside provider', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

        expect(() => {
            renderHook(() => useFavoritesContext())
        }).toThrow('useFavorites must be used within a FavoritesProvider')

        consoleSpy.mockRestore()
    })
})
