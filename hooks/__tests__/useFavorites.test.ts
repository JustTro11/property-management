import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '../useFavorites'

describe('useFavorites', () => {
    beforeEach(() => {
        localStorage.clear()
        jest.clearAllMocks()
    })

    it('should initialize with empty favorites', () => {
        const { result } = renderHook(() => useFavorites())
        expect(result.current.favorites).toEqual([])
        expect(result.current.isLoaded).toBe(true)
    })

    it('should add item to favorites', () => {
        const { result } = renderHook(() => useFavorites())
        const propId = '123'

        act(() => {
            result.current.toggleFavorite(propId)
        })

        expect(result.current.favorites).toContain(propId)
        expect(result.current.isFavorite(propId)).toBe(true)
        expect(JSON.parse(localStorage.getItem('property_favorites')!)).toContain(propId)
    })

    it('should remove item from favorites', () => {
        const { result } = renderHook(() => useFavorites())
        const propId = '123'

        act(() => {
            result.current.toggleFavorite(propId) // Add
        })
        act(() => {
            result.current.toggleFavorite(propId) // Remove
        })

        expect(result.current.favorites).not.toContain(propId)
        expect(result.current.isFavorite(propId)).toBe(false)
        expect(JSON.parse(localStorage.getItem('property_favorites')!)).not.toContain(propId)
    })

    it('should load favorites from localStorage on mount', () => {
        const initialFavorites = ['1', '2']
        localStorage.setItem('property_favorites', JSON.stringify(initialFavorites))

        const { result } = renderHook(() => useFavorites())

        expect(result.current.favorites).toEqual(initialFavorites)
    })
})
