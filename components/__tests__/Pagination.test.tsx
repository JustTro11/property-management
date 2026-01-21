import { render, screen } from '@testing-library/react'
import Pagination from '@/components/Pagination'

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string, params: any) => {
        if (key === 'showing') return `Showing ${params.start}-${params.end} of ${params.total}`
        return key
    },
}))

jest.mock('@/lib/navigation', () => ({
    Link: ({ children, href, className, 'aria-disabled': ariaDisabled }: any) => (
        <a href={href} className={className} aria-disabled={ariaDisabled}>{children}</a>
    ),
    usePathname: () => '/properties',
}))

jest.mock('next/navigation', () => ({
    useSearchParams: () => new URLSearchParams(),
}))

describe('Pagination', () => {
    it('does not render if totalPages <= 1', () => {
        const { container } = render(<Pagination totalPages={1} currentPage={1} totalItems={10} itemsPerPage={10} />)
        expect(container).toBeEmptyDOMElement()
    })

    it('renders pagination controls', () => {
        render(<Pagination totalPages={3} currentPage={2} totalItems={30} itemsPerPage={10} />)

        expect(screen.getByText('Showing 11-20 of 30')).toBeInTheDocument()
        expect(screen.getByText('previous')).toBeInTheDocument()
        expect(screen.getByText('next')).toBeInTheDocument()

        // Check page numbers
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('3')).toBeInTheDocument()

        // Check hrefs
        expect(screen.getByText('1').closest('a')).toHaveAttribute('href', '/properties?page=1')
        expect(screen.getByText('3').closest('a')).toHaveAttribute('href', '/properties?page=3')
    })

    it('disables previous on first page', () => {
        render(<Pagination totalPages={3} currentPage={1} totalItems={30} itemsPerPage={10} />)
        const prevLink = screen.getByText('previous').closest('a')
        expect(prevLink).toHaveAttribute('aria-disabled', 'true')
        expect(prevLink).toHaveAttribute('href', '#')
    })

    it('disables next on last page', () => {
        render(<Pagination totalPages={3} currentPage={3} totalItems={30} itemsPerPage={10} />)
        const nextLink = screen.getByText('next').closest('a')
        expect(nextLink).toHaveAttribute('aria-disabled', 'true')
        expect(nextLink).toHaveAttribute('href', '#')
    })
})
