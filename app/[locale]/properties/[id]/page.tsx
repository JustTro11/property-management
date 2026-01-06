import { createClient } from '@/lib/supabaseServer'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Share2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import PropertyGallery from '@/components/PropertyGallery'
import PropertyActions from '@/components/PropertyActions'
import { Property } from '@/types'
import { getTranslations } from 'next-intl/server'

// Mock data for fallback (same as landing page + description)
const MOCK_PROPERTY_DETAILS = {
    id: '1',
    title: "Modern Downtown Loft",
    price: 3500,
    address: "123 Main St, City Center",
    description: "Experience the pulse of the city in this stunning modern loft. Featuring high ceilings, exposed brick, and floor-to-ceiling windows, this unit offers the perfect blend of industrial charm and contemporary luxury. The open-concept living area is perfect for entertaining, while the state-of-the-art kitchen will inspire your inner chef. Amenities include a rooftop terrace, fitness center, and 24/7 concierge service.",
    image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop"],
    sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    status: 'available' as Property['status']
}

export default async function PropertyDetails({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()
    const t = await getTranslations('PropertyDetails')

    let property: Property | null = null

    // Fetch from Supabase
    try {
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .single()

        if (data) {
            property = data
        } else {
            // Fallback for demo if DB is empty and ID matches mock
            if (id === '1') property = MOCK_PROPERTY_DETAILS
        }
    } catch (e) {
        if (id === '1') property = MOCK_PROPERTY_DETAILS
    }

    if (!property) {
        return notFound()
    }

    return (
        <main className="min-h-screen bg-bg-primary pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link href="/properties" className="inline-flex items-center text-zinc-500 dark:text-zinc-400 hover:text-text-primary dark:hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    {t('backToListings')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <PropertyGallery
                            images={property.images && property.images.length > 0 ? property.images : (property.image_url ? [property.image_url] : [])}
                            title={property.title}
                            status={property.status}
                        />
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col h-full">
                        <div className="mb-6">
                            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">{property.title}</h1>
                            <div className="flex items-center text-zinc-500 dark:text-zinc-400">
                                <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                                {property.address}
                            </div>
                        </div>

                        <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 mb-8 backdrop-blur-sm">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                    <Bed className="w-6 h-6 text-indigo-500 mb-2" />
                                    <span className="text-xl font-bold text-text-primary">{property.bedrooms}</span>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('beds')}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                    <Bath className="w-6 h-6 text-indigo-500 mb-2" />
                                    <span className="text-xl font-bold text-text-primary">{property.bathrooms}</span>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('baths')}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                    <Maximize className="w-6 h-6 text-indigo-500 mb-2" />
                                    <span className="text-xl font-bold text-text-primary">{property.sqft}</span>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('sqft')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 mb-8">
                            <h3 className="text-xl font-semibold text-text-primary mb-4">{t('description')}</h3>
                            <p>{property.description || t('noDescription')}</p>
                        </div>



                        <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-8 flex items-center justify-between">
                            <div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-1 uppercase tracking-wide font-medium">{t('monthlyRent')}</p>
                                <p className="text-4xl xs:text-5xl font-extrabold text-text-primary tracking-tight flex items-baseline">
                                    ${property.price.toLocaleString()}
                                    <span className="text-lg text-zinc-400 dark:text-zinc-500 font-normal ml-1">{t('perMonth')}</span>
                                </p>
                            </div>
                            <PropertyActions title={property.title} price={property.price} isAvailable={property.status === 'available'} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
