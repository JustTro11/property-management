import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

// Mock react-datepicker
jest.mock('react-datepicker', () => {
    const MockDatePicker = ({ id }: { id?: string }) => (
        <input id={id} type="text" data-testid={id} />
    )
    return MockDatePicker
})

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

    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    it('renders KPI cards correctly', () => {
        render(<AdminAnalytics summary={mockSummary} />)

        expect(screen.getByText('Total Views')).toBeInTheDocument()
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

    describe('with time range selection', () => {
        it('renders the TimeRangeSelector', () => {
            render(<AdminAnalytics summary={mockSummary} />)

            expect(screen.getByRole('button', { name: /7 days/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /30 days/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /90 days/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /all time/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /custom/i })).toBeInTheDocument()
        })

        it('defaults to 30 days preset', () => {
            render(<AdminAnalytics summary={mockSummary} />)

            const button = screen.getByRole('button', { name: /30 days/i })
            expect(button).toHaveClass('bg-indigo-600')
        })

        it('fetches new data when time range changes', async () => {
            const updatedSummary = { ...mockSummary, totalViews: 5000 }
                ; (global.fetch as jest.Mock).mockResolvedValue({
                    ok: true,
                    json: () => Promise.resolve(updatedSummary)
                })

            render(<AdminAnalytics summary={mockSummary} />)

            fireEvent.click(screen.getByRole('button', { name: /7 days/i }))

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith('/api/analytics?preset=7d')
            })
        })

        it('shows loading state while fetching', async () => {
            let resolvePromise: (value: any) => void
                ; (global.fetch as jest.Mock).mockReturnValue(
                    new Promise((resolve) => { resolvePromise = resolve })
                )

            render(<AdminAnalytics summary={mockSummary} />)
            fireEvent.click(screen.getByRole('button', { name: /7 days/i }))

            // Should show loading indicator
            expect(screen.getByTestId('analytics-loading')).toBeInTheDocument()

            // Resolve the promise
            resolvePromise!({ ok: true, json: () => Promise.resolve(mockSummary) })

            await waitFor(() => {
                expect(screen.queryByTestId('analytics-loading')).not.toBeInTheDocument()
            })
        })

        it('updates displayed data after fetching', async () => {
            const updatedSummary = { ...mockSummary, totalViews: 9999 }
                ; (global.fetch as jest.Mock).mockResolvedValue({
                    ok: true,
                    json: () => Promise.resolve(updatedSummary)
                })

            render(<AdminAnalytics summary={mockSummary} />)

            // Initial value
            expect(screen.getByText('1234')).toBeInTheDocument()

            fireEvent.click(screen.getByRole('button', { name: /7 days/i }))

            await waitFor(() => {
                expect(screen.getByText('9999')).toBeInTheDocument()
            })
        })
    })
})

