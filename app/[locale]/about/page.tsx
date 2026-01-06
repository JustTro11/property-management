import { Link } from '@/lib/navigation'
import { ArrowLeft, Users, Shield, Clock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function AboutPage() {
    const t = await getTranslations('AboutPage')
    return (
        <main className="min-h-screen bg-bg-primary pt-32 pb-12 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-6xl mb-6">
                        {t('title')} <span className="text-indigo-500">{t('highlight')}</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
                        {t('intro')}
                    </p>
                </div>

                {/* Stats / Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center hover:border-indigo-500/50 transition-colors shadow-sm">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-6">
                            <Users className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">{t('cards.tenant.title')}</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">{t('cards.tenant.desc')}</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center hover:border-indigo-500/50 transition-colors shadow-sm">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-6">
                            <Shield className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">{t('cards.secure.title')}</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">{t('cards.secure.desc')}</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center hover:border-indigo-500/50 transition-colors shadow-sm">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-6">
                            <Clock className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">{t('cards.availability.title')}</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">{t('cards.availability.desc')}</p>
                    </div>
                </div>

                {/* Story Section */}
                <div className="bg-zinc-100 dark:bg-zinc-900/30 rounded-3xl p-8 lg:p-12 mb-20 border border-zinc-200 dark:border-zinc-800">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-text-primary mb-6">{t('philosophy.title')}</h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8">
                            {t('philosophy.content')}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-12 bg-indigo-500/50"></div>
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium tracking-widest text-sm uppercase">{t('philosophy.team')}</span>
                            <div className="h-px w-12 bg-indigo-500/50"></div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-text-primary mb-6">{t('cta.title')}</h2>
                    <Link
                        href="/properties"
                        className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-105"
                    >
                        {t('cta.button')}
                    </Link>
                </div>
            </div>
        </main>
    )
}
