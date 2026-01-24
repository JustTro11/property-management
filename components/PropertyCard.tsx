'use client'

import { Link } from '@/lib/navigation'
import FavoriteButton from '@/components/FavoriteButton'
import { Bed, Bath, Maximize, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Property } from '@/types'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function PropertyCard({ property }: { property: Property }) {
  const t = useTranslations('PropertyCard')
  const [imgSrc, setImgSrc] = useState(
    property.images && property.images.length > 0
      ? property.images[0]
      : property.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1073&auto=format&fit=crop'
  )

  const statusColors = {
    available: 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20',
    rented: 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20',
    maintenance: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20'
  }

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={imgSrc}
          alt={property.title}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
          onError={() => setImgSrc('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1073&auto=format&fit=crop')}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md z-10 ${statusColors[property.status]}`}>
          {t(`status.${property.status}`)}
        </div>

        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton propertyId={property.id} />
        </div>
      </div>
      <div className="p-5 flex-grow">
        <h3 className="text-lg font-semibold leading-6 text-text-primary dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          <span className="absolute inset-0" />
          {property.title}
        </h3>
        <p className="mt-1 text-2xl font-bold text-text-primary dark:text-white">
          ${property.price.toLocaleString()}
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 ml-1">{t('perMonth')}</span>
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <span className="truncate">{property.address}</span>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2 text-sm">
            <Bed className="w-4 h-4 text-indigo-500" />
            <span>{property.bedrooms} {t('beds')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Bath className="w-4 h-4 text-indigo-500" />
            <span>{property.bathrooms} {t('baths')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Maximize className="w-4 h-4 text-indigo-500" />
            <span>{property.sqft} {t('sqft')}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
