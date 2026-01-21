import { render, screen, fireEvent } from '@testing-library/react'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import { useLocale } from 'next-intl'

// Mock navigation
const mockRouter = { replace: jest.fn() }
jest.mock('@/lib/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/current-path',
}))

// Mock next-intl
jest.mock('next-intl', () => ({
    useLocale: jest.fn(),
}))

describe('LocaleSwitcher', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            // Default behavior
            ; (useLocale as jest.Mock).mockReturnValue('en')
    })

    it('renders correctly with current locale', () => {
        render(<LocaleSwitcher />)

        // Check for flag and name
        expect(screen.getByText('🇺🇸')).toBeInTheDocument()
        expect(screen.getByText('English')).toBeInTheDocument()
    })

    it('opens dropdown on click', () => {
        render(<LocaleSwitcher />)

        // Dropdown should not be visible initially
        expect(screen.queryByText('Language')).not.toBeInTheDocument()

        // Click button
        const button = screen.getByRole('button', { expanded: false })
        fireEvent.click(button)

        // Dropdown options should appear
        expect(screen.getByText('Español')).toBeInTheDocument()
    })

    it('changes locale when option is clicked', () => {
        render(<LocaleSwitcher />)

        // Open dropdown
        fireEvent.click(screen.getByRole('button', { expanded: false }))

        // Click Spanish
        fireEvent.click(screen.getByText('Español'))

        // Expect router replace to be called
        expect(mockRouter.replace).toHaveBeenCalledWith('/current-path', { locale: 'es' })
    })

    it('closes dropdown when clicking outside', () => {
        render(<LocaleSwitcher />)

        // Open dropdown
        fireEvent.click(screen.getByRole('button', { expanded: false }))
        expect(screen.getByText('Language')).toBeInTheDocument()

        // Click outside
        fireEvent.mouseDown(document.body)

        // Dropdown should be gone
        expect(screen.queryByText('Language')).not.toBeInTheDocument()
    })

    it('falls back to default locale if current locale is unknown', () => {
        // Mock unknown locale
        ; (useLocale as jest.Mock).mockReturnValue('fr')

        render(<LocaleSwitcher />)

        // Should show default (English)
        expect(screen.getByText('🇺🇸')).toBeInTheDocument()
        expect(screen.getByText('English')).toBeInTheDocument()
    })
})
