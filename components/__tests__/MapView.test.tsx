import { render, screen } from '@testing-library/react'
import MapView from '../MapView'
import { MOCK_PROPERTIES } from '@/lib/mockData'

// Mock Leaflet components since they rely on browser APIs not fully present in JSDOM
jest.mock('react-leaflet', () => ({
    MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>
}))

describe('MapView', () => {
    it('should render map container', () => {
        render(<MapView properties={MOCK_PROPERTIES} />)
        expect(screen.getByTestId('map-container')).toBeInTheDocument()
    })

    it('should render markers for properties', () => {
        render(<MapView properties={MOCK_PROPERTIES} />)
        const markers = screen.getAllByTestId('marker')
        expect(markers.length).toBe(MOCK_PROPERTIES.length)
    })

    it('should handle empty properties list', () => {
        render(<MapView properties={[]} />)
        expect(screen.getByTestId('map-container')).toBeInTheDocument()
        expect(screen.queryByTestId('marker')).not.toBeInTheDocument()
    })
})
