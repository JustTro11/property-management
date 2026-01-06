import { Link } from '@/lib/navigation'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('HomePage')

  return (
    <div className="relative isolate overflow-hidden bg-bg-secondary dark:bg-black py-24 sm:py-32">
      <div
        className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-40"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-2a4cd265a632?q=80&w=2675&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5)'
        }}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary dark:text-white sm:text-6xl animate-fade-in-up">
            {t('heroTitle')} <span className="text-indigo-500">{t('heroHighlight')}</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-secondary dark:text-gray-300">
            {t('heroSubtitle')}
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/properties"
              className="group rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all flex items-center gap-2"
            >
              {t('browseProperties')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-text-primary dark:text-white hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
              {t('learnMore')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
