import { render, screen, fireEvent } from '@testing-library/react'
import TimeRangeSelector from '../TimeRangeSelector'

// Mock react-datepicker to avoid issues with portal rendering in tests
jest.mock('react-datepicker', () => {
    const MockDatePicker = ({
        id,
        selected,
        onChange,
        'aria-label': ariaLabel
    }: {
        id?: string
        selected?: Date
        onChange: (date: Date | null) => void
        'aria-label'?: string
    }) => (
        <input
            id={id}
            type="text"
            aria-label={ariaLabel}
            value={selected ? selected.toISOString().split('T')[0] : ''}
            onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null
                onChange(date)
            }}
            data-testid={id}
        />
    )
    return MockDatePicker
})

describe('TimeRangeSelector', () => {
    const mockOnChange = jest.fn()

    beforeEach(() => {
        mockOnChange.mockClear()
    })

    it('renders all preset buttons', () => {
        render(<TimeRangeSelector value="30d" onChange={mockOnChange} />)

        expect(screen.getByRole('button', { name: /7 days/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /30 days/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /90 days/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /all time/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /custom/i })).toBeInTheDocument()
    })

    it('highlights the active preset', () => {
        render(<TimeRangeSelector value="7d" onChange={mockOnChange} />)

        const button = screen.getByRole('button', { name: /7 days/i })
        expect(button).toHaveClass('bg-indigo-600')
    })

    it('calls onChange with preset value when clicked', () => {
        render(<TimeRangeSelector value="30d" onChange={mockOnChange} />)

        fireEvent.click(screen.getByRole('button', { name: /7 days/i }))
        expect(mockOnChange).toHaveBeenCalledWith({ preset: '7d' })
    })

    it('shows date pickers when Custom is selected', () => {
        render(<TimeRangeSelector value="custom" onChange={mockOnChange} />)

        expect(screen.getByTestId('start-date')).toBeInTheDocument()
        expect(screen.getByTestId('end-date')).toBeInTheDocument()
    })

    it('does not show date pickers when preset is selected', () => {
        render(<TimeRangeSelector value="30d" onChange={mockOnChange} />)

        expect(screen.queryByTestId('start-date')).not.toBeInTheDocument()
    })

    it('calls onChange with custom dates when date picker changes', () => {
        const customStart = new Date('2026-01-01')
        const customEnd = new Date('2026-01-07')

        render(
            <TimeRangeSelector
                value="custom"
                onChange={mockOnChange}
                customStart={customStart}
                customEnd={customEnd}
            />
        )

        const startInput = screen.getByTestId('start-date')
        fireEvent.change(startInput, { target: { value: '2026-01-15' } })

        expect(mockOnChange).toHaveBeenCalledWith({
            preset: 'custom',
            customStart: expect.any(Date),
            customEnd: customEnd
        })
    })

    it('does not highlight inactive presets', () => {
        render(<TimeRangeSelector value="7d" onChange={mockOnChange} />)

        const button30d = screen.getByRole('button', { name: /30 days/i })
        expect(button30d).not.toHaveClass('bg-indigo-600')
    })
})
