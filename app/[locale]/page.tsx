import Hero from '@/components/Hero'
import PropertyCard from '@/components/PropertyCard'
import { createClient } from '@/lib/supabaseServer'
import { getTranslations } from 'next-intl/server'

// Mock data for initial render if DB is empty
const MOCK_PROPERTIES = [
  {
    id: '1',
    title: "Modern Downtown Loft",
    price: 3500,
    address: "123 Main St, City Center",
    image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop",
    sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    status: 'available' as const
  },
  {
    id: '2',
    title: "Secluded Hilltop Villa",
    price: 5200,
    address: "45 Skyline Dr, Beverly Hills",
    image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop",
    sqft: 2800,
    bedrooms: 4,
    bathrooms: 3,
    status: 'available' as const
  },
  {
    id: '3',
    title: "Oceanfront Glass Home",
    price: 8500,
    address: "789 Pacific Coast Hwy, Malibu",
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop",
    sqft: 3500,
    bedrooms: 3,
    bathrooms: 4,
    status: 'rented' as const
  }
]

export default async function Home() {
  const t = await getTranslations('HomePage')
  const supabase = await createClient()
  // Try to fetch from Supabase, fall back to mock if empty or error (graceful degradation for demo)
  let properties = []
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('status', { ascending: true }) // 'available' comes before 'maintenance' and 'rented'
      .order('created_at', { ascending: false })
      .limit(3)

    if (data && data.length > 0) {
      properties = data
    } else {
      properties = MOCK_PROPERTIES
    }
  } catch (e) {
    properties = MOCK_PROPERTIES
  }

  return (
    <main className="min-h-screen bg-bg-primary dark:bg-black">
      <Hero />

      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary dark:text-white mb-8 sm:mb-0">
            {t('featuredListings')} <span className="text-indigo-500">{t('featuredHighlight')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
}
