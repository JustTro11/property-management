'use client'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export type TimeRangeValue = '7d' | '30d' | '90d' | 'all' | 'custom'

interface TimeRangeChange {
    preset?: TimeRangeValue
    customStart?: Date
    customEnd?: Date
}

interface TimeRangeSelectorProps {
    value: TimeRangeValue
    onChange: (change: TimeRangeChange) => void
    customStart?: Date
    customEnd?: Date
}

const presets: { value: TimeRangeValue; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'all', label: 'All Time' },
    { value: 'custom', label: 'Custom' },
]

export default function TimeRangeSelector({
    value,
    onChange,
    customStart,
    customEnd,
}: TimeRangeSelectorProps) {
    const handlePresetClick = (preset: TimeRangeValue) => {
        onChange({ preset })
    }

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            onChange({ preset: 'custom', customStart: date, customEnd })
        }
    }

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            onChange({ preset: 'custom', customStart, customEnd: date })
        }
    }

    return (
        <div className="space-y-4">
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-zinc-700 p-1 bg-gray-50 dark:bg-zinc-800/50">
                {presets.map((preset) => (
                    <button
                        key={preset.value}
                        type="button"
                        onClick={() => handlePresetClick(preset.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${value === preset.value
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                            }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {value === 'custom' && (
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <label htmlFor="start-date" className="text-sm text-gray-600 dark:text-zinc-400">
                            Start Date
                        </label>
                        <DatePicker
                            id="start-date"
                            selected={customStart}
                            onChange={handleStartDateChange}
                            selectsStart
                            startDate={customStart}
                            endDate={customEnd}
                            maxDate={customEnd || new Date()}
                            className="px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            dateFormat="MM/dd/yyyy"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="end-date" className="text-sm text-gray-600 dark:text-zinc-400">
                            End Date
                        </label>
                        <DatePicker
                            id="end-date"
                            selected={customEnd}
                            onChange={handleEndDateChange}
                            selectsEnd
                            startDate={customStart}
                            endDate={customEnd}
                            minDate={customStart}
                            maxDate={new Date()}
                            className="px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            dateFormat="MM/dd/yyyy"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
