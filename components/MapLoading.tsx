'use client'

import { useTranslations } from 'next-intl'

export default function MapLoading() {
    const t = useTranslations('Map')
    return (
        <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center dark:bg-zinc-800 dark:text-zinc-500">
            {t('loading')}
        </div>
    )
}
