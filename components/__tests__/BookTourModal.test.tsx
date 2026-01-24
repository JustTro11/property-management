import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookTourModal from '@/components/BookTourModal'
import userEvent from '@testing-library/user-event'

// Mock next-intl
jest.mock('next-intl', () => ({
    useTranslations: () => {
        const t = (key: string) => {
            const messages: Record<string, string> = {
                'title': 'Book a Tour',
                'subtitle': 'Interested in',
                'fields.name': 'Full Name',
                'fields.nameRequired': 'Name is required',
                'fields.email': 'Email',
                'fields.emailRequired': 'Email is required',
                'fields.emailInvalid': 'Invalid email',
                'fields.phone': 'Phone',
                'fields.phoneRequired': 'Phone is required',
                'fields.phoneInvalid': 'Invalid phone',
                'fields.date': 'Preferred Date',
                'fields.dateRequired': 'Date is required',
                'fields.datePast': 'Date cannot be in the past',
                'submit': 'Schedule Tour',
                'successTitle': 'Request Sent!',
            }
            return messages[key] || key
        }
        t.rich = (key: string, values: any) => {
            if (key === 'successMessage') {
                return `We have received your request for ${values.property}.`
            }
            return key
        }
        return t
    },
    useFormatter: () => ({
        dateTime: () => 'formatted date'
    }),
    NextIntlClientProvider: ({ children }: any) => children
}))

// Mock fetch
global.fetch = jest.fn() as jest.Mock

describe('BookTourModal', () => {
    const mockOnClose = jest.fn()
    const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        propertyTitle: 'Sunset Villa',
        propertyId: 'prop-123'
    }

    beforeEach(() => {
        jest.clearAllMocks()
            ; (global.fetch as jest.Mock).mockResolvedValue({ ok: true })
    })

    const renderModal = () => render(
        <BookTourModal {...defaultProps} />
    )

    it('renders correctly when open', () => {
        renderModal()
        expect(screen.getByText('Book a Tour')).toBeInTheDocument()
        expect(screen.getByText('Sunset Villa')).toBeInTheDocument()
    })

    it('validates form inputs', async () => {
        renderModal()

        const submitBtn = screen.getByRole('button', { name: /schedule tour/i })
        fireEvent.click(submitBtn)

        await waitFor(() => {
            expect(screen.getByText('Name is required')).toBeInTheDocument()
            expect(screen.getByText('Email is required')).toBeInTheDocument()
        })
    })

    it('submits form and tracks inquiry on success', async () => {
        const user = userEvent.setup()
        renderModal()

        // Fill form
        await user.type(screen.getByPlaceholderText('John Doe'), 'Alice Smith')
        await user.type(screen.getByPlaceholderText('john@example.com'), 'alice@example.com')
        await user.type(screen.getByPlaceholderText('(555) 000-0000'), '555-0123')

        // Select tomorrow's date
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const dateStr = tomorrow.toISOString().split('T')[0]
        fireEvent.change(screen.getByLabelText(/preferred date/i), { target: { value: dateStr } })

        // Submit
        const submitBtn = screen.getByRole('button', { name: /schedule tour/i })
        await user.click(submitBtn)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/send-email', expect.anything())
        })

        // Verify Tracking Call
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/analytics/track', expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('inquiry')
            }))
        })

        // Verify Success Message
        expect(screen.getByText('Request Sent!')).toBeInTheDocument()
    })

    it('does not track inquiry if email fails', async () => {
        ; (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false }) // Email fails
        const user = userEvent.setup()
        renderModal()

        // Fill form using userEvent
        await user.type(screen.getByPlaceholderText('John Doe'), 'Bob Error')
        await user.type(screen.getByPlaceholderText('john@example.com'), 'bob@example.com')
        await user.type(screen.getByPlaceholderText('(555) 000-0000'), '555-0123')

        // Select Date
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const dateStr = tomorrow.toISOString().split('T')[0]

        // Find input by label text (using regex for case insensitivity)
        // or by placeholder if it had one, or role 'combobox' if it was custom.
        // Standard input[type=date] doesn't always have a role.
        // We can use container query or getByLabelText since we know the label "Preferred Date".
        const dateInput = screen.getByLabelText(/preferred date/i)
        fireEvent.change(dateInput, { target: { value: dateStr } })

        const submitBtn = screen.getByRole('button', { name: /schedule tour/i })
        await user.click(submitBtn)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/send-email', expect.anything())
        })

        // Should NOT track inquiry
        expect(global.fetch).not.toHaveBeenCalledWith('/api/analytics/track', expect.anything())

        // Should NOT show success message
        expect(screen.queryByText('Request Sent!')).not.toBeInTheDocument()
    })
})
