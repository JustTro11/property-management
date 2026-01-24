import { NextResponse } from 'next/server'
import { getPropertiesByIds } from '@/lib/services/propertyService'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { ids } = body

        if (!Array.isArray(ids)) {
            return NextResponse.json({ error: 'Invalid IDs format' }, { status: 400 })
        }

        const properties = await getPropertiesByIds(ids)
        return NextResponse.json(properties)
    } catch (error) {
        console.error('Batch fetch error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
