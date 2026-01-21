import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/components/ThemeProvider'

// Mock ThemeProvider hook
jest.mock('@/components/ThemeProvider', () => ({
    useTheme: jest.fn(),
}))

describe('ThemeToggle', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders placeholder if not mounted', () => {
        (useTheme as jest.Mock).mockReturnValue({
            theme: 'light',
            toggleTheme: jest.fn(),
            mounted: false
        })
        const { container } = render(<ThemeToggle />)
        expect(container.firstChild).toHaveClass('w-8 h-8')
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders sun icon in dark mode', () => {
        (useTheme as jest.Mock).mockReturnValue({
            theme: 'dark',
            toggleTheme: jest.fn(),
            mounted: true
        })
        render(<ThemeToggle />)
        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
    })

    it('renders moon icon in light mode', () => {
        (useTheme as jest.Mock).mockReturnValue({
            theme: 'light',
            toggleTheme: jest.fn(),
            mounted: true
        })
        render(<ThemeToggle />)
        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
    })

    it('toggles theme on click', () => {
        const toggleTheme = jest.fn()
            ; (useTheme as jest.Mock).mockReturnValue({
                theme: 'light',
                toggleTheme,
                mounted: true
            })
        render(<ThemeToggle />)
        fireEvent.click(screen.getByRole('button'))
        expect(toggleTheme).toHaveBeenCalled()
    })
})
