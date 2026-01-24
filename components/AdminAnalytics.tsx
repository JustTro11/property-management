'use client'

import { useState, useCallback } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { Eye, Heart, List, Loader2 } from 'lucide-react'
import { AnalyticsSummary } from '@/lib/services/analyticsService'
import TimeRangeSelector, { TimeRangeValue } from './TimeRangeSelector'

interface AdminAnalyticsProps {
    summary: AnalyticsSummary
}

export default function AdminAnalytics({ summary: initialSummary }: AdminAnalyticsProps) {
    const [summary, setSummary] = useState(initialSummary)
    const [timeRange, setTimeRange] = useState<TimeRangeValue>('30d')
    const [customStart, setCustomStart] = useState<Date | undefined>()
    const [customEnd, setCustomEnd] = useState<Date | undefined>(new Date())
    const [isLoading, setIsLoading] = useState(false)

    const fetchAnalytics = useCallback(async (params: URLSearchParams) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/analytics?${params.toString()}`)
            if (response.ok) {
                const data = await response.json()
                setSummary(data)
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleTimeRangeChange = useCallback(({
        preset,
        customStart: newStart,
        customEnd: newEnd
    }: {
        preset?: TimeRangeValue
        customStart?: Date
        customEnd?: Date
    }) => {
        if (preset) {
            setTimeRange(preset)

            if (preset === 'custom') {
                if (newStart) setCustomStart(newStart)
                if (newEnd) setCustomEnd(newEnd)

                if (newStart && newEnd) {
                    const params = new URLSearchParams()
                    params.set('start', newStart.toISOString().split('T')[0])
                    params.set('end', newEnd.toISOString().split('T')[0])
                    fetchAnalytics(params)
                }
            } else {
                const params = new URLSearchParams()
                params.set('preset', preset)
                fetchAnalytics(params)
            }
        }
    }, [fetchAnalytics])

    return (
        <div className="space-y-8 mb-12">
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
                    <TimeRangeSelector
                        value={timeRange}
                        onChange={handleTimeRangeChange}
                        customStart={customStart}
                        customEnd={customEnd}
                    />
                </div>

                {/* KPI Cards */}
                <div className="relative">
                    {isLoading && (
                        <div
                            data-testid="analytics-loading"
                            className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 flex items-center justify-center z-10 rounded-lg"
                        >
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-zinc-800">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Eye className="h-6 w-6 text-indigo-500" aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-zinc-400 truncate">
                                                Total Views
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {summary.totalViews}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-zinc-800">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Heart className="h-6 w-6 text-rose-500" aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-zinc-400 truncate">
                                                Total Favorites
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {summary.totalFavorites}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-zinc-800">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <List className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-zinc-400 truncate">
                                                Total Inquiries
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {summary.totalInquiries}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="relative bg-white dark:bg-zinc-900 shadow rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 flex items-center justify-center z-10 rounded-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    )}
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-6">
                        Views Over Time
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={summary.viewsByDate}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={20}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Properties List */}
                <div className="relative bg-white dark:bg-zinc-900 shadow rounded-lg border border-gray-200 dark:border-zinc-800">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 flex items-center justify-center z-10 rounded-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    )}
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-zinc-800">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                            Top Performing Properties
                        </h3>
                    </div>
                    <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
                        {summary.topProperties.length > 0 ? (
                            summary.topProperties.map((property) => (
                                <li key={property.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate w-3/4">
                                            {property.title}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                {property.views} Views
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">No data available yet</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
