import { render, screen, fireEvent } from '@testing-library/react'
import FavoriteButton from '@/components/FavoriteButton'
import { useFavorites } from '@/hooks/useFavorites'

// Mock icons
jest.mock('lucide-react', () => ({
    Heart: ({ className }: { className: string }) => <div data-testid="heart-icon" className={className} />
}))

// Mock hook
jest.mock('@/hooks/useFavorites')

describe('FavoriteButton', () => {
    const mockToggle = jest.fn()
    const mockIsFavorite = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            // Default mock implementation
            ; (useFavorites as jest.Mock).mockReturnValue({
                isFavorite: mockIsFavorite,
                toggleFavorite: mockToggle,
                isLoaded: true
            })
    })

    it('toggles favorite state on click', () => {
        mockIsFavorite.mockReturnValue(false) // Initially not favorited

        // Rerender to picking up the mock return value if needed, 
        // but here we render fresh.
        const { rerender } = render(<FavoriteButton propertyId="test-1" />)

        const button = screen.getByRole('button', { name: /add to favorites/i })
        expect(button).toBeInTheDocument()

        // Check icon style (should be gray/default)
        const icon = screen.getByTestId('heart-icon')
        expect(icon.className).toContain('text-gray-600')

        // Simulate interaction (click calls toggle)
        fireEvent.click(button)
        expect(mockToggle).toHaveBeenCalledWith('test-1')

        // Simulate state change (hook return value changes)
        // We create a new function reference to trigger the useEffect dependency change
        const mockIsFavoriteTrue = jest.fn().mockReturnValue(true)
            ; (useFavorites as jest.Mock).mockReturnValue({
                isFavorite: mockIsFavoriteTrue,
                toggleFavorite: mockToggle,
                isLoaded: true
            })

        // Force re-render with new hook value
        rerender(<FavoriteButton propertyId="test-1" />)

        expect(screen.getByRole('button', { name: /remove from favorites/i })).toBeInTheDocument()
        expect(screen.getByTestId('heart-icon').className).toContain('text-red-500')
    })

    it('prevents default event propagation', () => {
        const handleClick = jest.fn()
        render(
            <div onClick={handleClick}>
                <FavoriteButton propertyId="test-2" />
            </div>
        )

        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockToggle).toHaveBeenCalledWith('test-2')
        expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not render if not loaded', () => {
        (useFavorites as jest.Mock).mockReturnValue({
            isLoaded: false
        })
        const { container } = render(<FavoriteButton propertyId="test-3" />)
        expect(container).toBeEmptyDOMElement()
    })
})
