import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

// Mock next-intl
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}))

// Mock navigation
jest.mock('@/lib/navigation', () => ({
    Link: ({ children, href, className }: any) => <a href={href} className={className}>{children}</a>
}))

describe('Hero', () => {
    it('renders hero content', () => {
        render(<Hero />)

        // Assert texts from translation keys
        expect(screen.getByText('heroTitle')).toBeInTheDocument()
        expect(screen.getByText('heroHighlight')).toBeInTheDocument()
        expect(screen.getByText('heroSubtitle')).toBeInTheDocument()
        expect(screen.getByText('browseProperties')).toBeInTheDocument()
        expect(screen.getByText('learnMore')).toBeInTheDocument()

        // Assert links
        expect(screen.getByRole('link', { name: /browseProperties/i })).toHaveAttribute('href', '/properties')
        expect(screen.getByRole('link', { name: /learnMore/i })).toHaveAttribute('href', '/about')
    })
})
