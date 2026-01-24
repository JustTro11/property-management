import { render, screen, fireEvent } from '@testing-library/react'
import PropertyCard from '@/components/PropertyCard'
import { FavoritesProvider } from '@/components/FavoritesContext'
import { Property } from '@/types'

// Mock next-intl
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}))

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ fill, ...props }: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt} />
    },
}))

// Mock navigation
jest.mock('@/lib/navigation', () => ({
    Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

const mockProperty: Property = {
    id: '123',
    title: 'Test Villa',
    description: 'A beautiful test villa',
    price: 5000,
    address: '123 Test St',
    image_url: 'https://example.com/image.jpg',
    images: ['https://example.com/image.jpg'],
    sqft: 2000,
    bedrooms: 3,
    bathrooms: 2,
    status: 'available',
    created_at: '2023-01-01',
    lat: 34.052235,
    lng: -118.243683,
}

describe('PropertyCard', () => {
    it('renders property details correctly', () => {
        render(
            <FavoritesProvider>
                <PropertyCard property={mockProperty} />
            </FavoritesProvider>
        )

        expect(screen.getByText('Test Villa')).toBeInTheDocument()
        expect(screen.getByText('$5,000')).toBeInTheDocument()
        expect(screen.getByText('123 Test St')).toBeInTheDocument()
        expect(screen.getByText('3 beds')).toBeInTheDocument()
        expect(screen.getByText('2 baths')).toBeInTheDocument()
        expect(screen.getByText('2000 sqft')).toBeInTheDocument()
    })

    it('renders correct status badge', () => {
        render(
            <FavoritesProvider>
                <PropertyCard property={mockProperty} />
            </FavoritesProvider>
        )
        expect(screen.getByText('status.available')).toBeInTheDocument()
    })

    it('displays correct status badge', () => {
        const rentedProperty = { ...mockProperty, status: 'rented' as const }
        render(
            <FavoritesProvider>
                <PropertyCard property={rentedProperty} />
            </FavoritesProvider>
        )

        expect(screen.getByText('status.rented')).toBeInTheDocument()
    })

    it('renders maintenance status correctly', () => {
        const maintenanceProperty = { ...mockProperty, status: 'maintenance' as const }
        render(
            <FavoritesProvider>
                <PropertyCard property={maintenanceProperty} />
            </FavoritesProvider>
        )
        expect(screen.getByText('status.maintenance')).toBeInTheDocument()
    })

    it('uses image_url if images array is empty', () => {
        const propertyWithoutImages = {
            ...mockProperty,
            images: [],
            image_url: 'https://example.com/single-image.jpg'
        }
        render(
            <FavoritesProvider>
                <PropertyCard property={propertyWithoutImages} />
            </FavoritesProvider>
        )
        const img = screen.getByAltText('Test Villa')
        // Next.js Image component modifies src, so we check if it contains the url
        expect(img.getAttribute('src')).toContain('single-image.jpg')
    })

    it('uses default fallback if no images provided at all', () => {
        const propertyNoImages = {
            ...mockProperty,
            images: [],
            image_url: null
        } as unknown as Property
        render(
            <FavoritesProvider>
                <PropertyCard property={propertyNoImages} />
            </FavoritesProvider>
        )
        const img = screen.getByAltText('Test Villa')
        // Check for the fallback URL used in component
        expect(img.getAttribute('src')).toContain('photo-1560518883')
    })

    it('switches to fallback image on error', () => {
        // Use a property that has a primary image
        render(
            <FavoritesProvider>
                <PropertyCard property={mockProperty} />
            </FavoritesProvider>
        )
        const img = screen.getByAltText('Test Villa')

        // Simulate error on the main image
        fireEvent.error(img)

        // Should switch to fallback
        expect(img.getAttribute('src')).toContain('photo-1560518883')
    })
})
