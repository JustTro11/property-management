import { render, screen } from '@testing-library/react'
import AdminAnalytics from '@/components/AdminAnalytics'
import { AnalyticsSummary } from '@/lib/services/analyticsService'

// Mock analytics service to prevent server-side imports from breaking tests
jest.mock('@/lib/services/analyticsService', () => ({
    getAnalyticsSummary: jest.fn()
}))

// Mock Recharts to avoid sizing issues in JSDOM
jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
    LineChart: () => null,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
}))

describe('AdminAnalytics', () => {
    const mockSummary: AnalyticsSummary = {
        totalViews: 1234,
        totalFavorites: 56,
        totalInquiries: 7,
        viewsByDate: [
            { date: '01/01', views: 10 },
            { date: '01/02', views: 20 },
        ],
        topProperties: [
            { id: '1', title: 'Luxury Villa', views: 100 },
            { id: '2', title: 'Downtown Loft', views: 90 },
        ]
    }

    it('renders KPI cards correctly', () => {
        render(<AdminAnalytics summary={mockSummary} />)

        expect(screen.getByText('Total Views (30d)')).toBeInTheDocument()
        expect(screen.getByText('1234')).toBeInTheDocument()

        expect(screen.getByText('Total Favorites')).toBeInTheDocument()
        expect(screen.getByText('56')).toBeInTheDocument()

        expect(screen.getByText('Total Inquiries')).toBeInTheDocument()
        expect(screen.getByText('7')).toBeInTheDocument()
    })

    it('renders Top Properties list', () => {
        render(<AdminAnalytics summary={mockSummary} />)

        expect(screen.getByText('Top Performing Properties')).toBeInTheDocument()
        expect(screen.getByText('Luxury Villa')).toBeInTheDocument()
        expect(screen.getByText('100 Views')).toBeInTheDocument()
        expect(screen.getByText('Downtown Loft')).toBeInTheDocument()
    })

    it('renders empty state nicely', () => {
        const emptySummary = { ...mockSummary, topProperties: [] }
        render(<AdminAnalytics summary={emptySummary} />)

        expect(screen.getByText('No data available yet')).toBeInTheDocument()
    })
})
