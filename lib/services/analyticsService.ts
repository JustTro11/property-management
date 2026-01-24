import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@/lib/supabaseServer'

export type EventType = 'view' | 'favorite' | 'inquiry'

export interface AnalyticsEvent {
    property_id?: string
    event_type: EventType
    metadata?: any
}

export const trackEvent = async (event: AnalyticsEvent) => {
    try {
        await supabase.from('analytics').insert([event])
    } catch (error) {
        console.error('Error tracking event:', error)
    }
}

export interface AnalyticsSummary {
    totalViews: number
    totalFavorites: number
    totalInquiries: number
    topProperties: {
        id: string
        title: string
        views: number
    }[]
    viewsByDate: {
        date: string
        views: number
    }[]
}

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
    const supabaseServer = await createClient()

    // Default empty summary
    const summary: AnalyticsSummary = {
        totalViews: 0,
        totalFavorites: 0,
        totalInquiries: 0,
        topProperties: [],
        viewsByDate: []
    }

    try {
        // Fetch all analytics events (restricted by RLS to admin)
        // Note: For large datasets, use count() or specific RPCs. For MVP, we fetch raw.
        const { data, error } = await supabaseServer
            .from('analytics')
            .select('*, properties(title)')
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

        if (error || !data) return summary

        // Process data
        summary.totalViews = data.filter(e => e.event_type === 'view').length
        summary.totalFavorites = data.filter(e => e.event_type === 'favorite').length
        summary.totalInquiries = data.filter(e => e.event_type === 'inquiry').length

        // Top Properties
        const viewsByProperty: Record<string, { count: number, title: string }> = {}
        data.filter(e => e.event_type === 'view' && e.property_id).forEach(e => {
            const pid = e.property_id
            if (!viewsByProperty[pid]) {
                viewsByProperty[pid] = { count: 0, title: e.properties?.title || 'Unknown' }
            }
            viewsByProperty[pid].count++
        })

        summary.topProperties = Object.entries(viewsByProperty)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5)
            .map(([id, stats]) => ({ id, title: stats.title, views: stats.count }))

        // Views by Date (Last 30 days)
        const viewsByDateMap: Record<string, number> = {}
        data.filter(e => e.event_type === 'view').forEach(e => {
            const date = new Date(e.created_at).toLocaleDateString('en-US')
            viewsByDateMap[date] = (viewsByDateMap[date] || 0) + 1
        })

        // Fill in last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US')
            summary.viewsByDate.push({
                date,
                views: viewsByDateMap[date] || 0
            })
        }

    } catch (e) {
        console.error('Failed to fetch analytics:', e)
    }

    return summary
}
