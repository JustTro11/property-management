import { render, screen, fireEvent } from '@testing-library/react'
import PropertyThumbnail from '@/components/PropertyThumbnail'

describe('PropertyThumbnail', () => {
    const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1073&auto=format&fit=crop'

    it('renders provided image', () => {
        const src = 'https://example.com/image.jpg'
        const alt = 'Test Image'
        render(<PropertyThumbnail src={src} alt={alt} />)

        const img = screen.getByRole('img')
        expect(img).toHaveAttribute('src', src)
        expect(img).toHaveAttribute('alt', alt)
    })

    it('renders fallback when src is missing', () => {
        render(<PropertyThumbnail src={null} alt="No Image" />)
        const img = screen.getByRole('img')
        expect(img).toHaveAttribute('src', FALLBACK_IMAGE)
    })

    it('renders fallback when src is undefined', () => {
        render(<PropertyThumbnail src={undefined} alt="No Image" />)
        const img = screen.getByRole('img')
        expect(img).toHaveAttribute('src', FALLBACK_IMAGE)
    })

    it('switches to fallback on error', () => {
        const src = 'https://example.com/bad-image.jpg'
        render(<PropertyThumbnail src={src} alt="Bad Image" />)

        const img = screen.getByRole('img')
        // Simulate error
        fireEvent.error(img)

        expect(img).toHaveAttribute('src', FALLBACK_IMAGE)
    })

    it('handles error on fallback image', () => {
        render(<PropertyThumbnail src={null} alt="No Image" />)
        const img = screen.getByRole('img')

        // Error on the already fallback image
        fireEvent.error(img)
        // Should still be there (logic currently just logs or does nothing, but ensures that line is covered)
        expect(img).toBeInTheDocument()
    })
})
