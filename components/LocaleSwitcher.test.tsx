import { render, screen, fireEvent } from '@testing-library/react'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import { useRouter, usePathname } from '@/lib/navigation'

// Mock navigation
const mockRouter = { replace: jest.fn() }
jest.mock('@/lib/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/current-path',
}))

// Mock next-intl
jest.mock('next-intl', () => ({
    useLocale: () => 'en',
}))

describe('LocaleSwitcher', () => {
    afterEach(() => {
        jest.clearAllMocks()
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
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

        // Click button
        const button = screen.getByRole('button', { expanded: false })
        fireEvent.click(button)

        // Dropdown options should appear
        expect(screen.getByText('Español')).toBeInTheDocument()
        expect(screen.getByText('简体中文')).toBeInTheDocument()
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
})
