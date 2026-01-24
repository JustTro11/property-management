import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/services/analyticsService'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { property_id, event_type, metadata } = body

        if (!event_type) {
            return NextResponse.json({ error: 'Missing event_type' }, { status: 400 })
        }

        await trackEvent({
            property_id,
            event_type,
            metadata
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
