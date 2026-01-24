import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { getAnalyticsSummary } from '@/lib/services/analyticsService'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const preset = searchParams.get('preset')
        const startParam = searchParams.get('start')
        const endParam = searchParams.get('end')

        let startDate: Date | undefined
        let endDate: Date | undefined = new Date()
        let allTime = false

        if (preset) {
            const now = new Date()
            endDate = now

            switch (preset) {
                case '7d':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    break
                case '30d':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                    break
                case '90d':
                    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
                    break
                case 'all':
                    allTime = true
                    startDate = undefined
                    break
                default:
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            }
        } else if (startParam && endParam) {
            startDate = new Date(startParam)
            endDate = new Date(endParam)

            // Validate dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
            }
        }

        const summary = await getAnalyticsSummary(startDate, endDate, allTime)
        return NextResponse.json(summary)
    } catch (error) {
        console.error('Analytics API error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
