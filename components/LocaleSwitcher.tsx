'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { usePathname, useRouter } from '@/lib/navigation'
import { useLocale } from 'next-intl'

const locales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '简体中文', flag: '🇨🇳' },
    { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
]

export default function LocaleSwitcher() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const currentLocale = locales.find(l => l.code === locale) || locales[0]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLocaleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
        setIsOpen(false)
    }

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary hover:bg-bg-secondary/80 border border-border-color text-text-secondary hover:text-text-primary transition-all duration-200"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="text-base">{currentLocale.flag}</span>
                <span className="text-sm font-medium hidden sm:inline">
                    {currentLocale.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 py-2 bg-bg-primary rounded-xl border border-border-color shadow-xl z-50">
                    <div className="px-3 py-1.5 mb-1">
                        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                            Language
                        </p>
                    </div>
                    {locales.map((loc) => (
                        <button
                            key={loc.code}
                            onClick={() => handleLocaleChange(loc.code)}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-bg-secondary transition-colors ${locale === loc.code
                                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                                : 'text-text-primary'
                                }`}
                            role="option"
                            aria-selected={locale === loc.code}
                        >
                            <span className="text-lg">{loc.flag}</span>
                            <span className="flex-1 text-sm font-medium">{loc.name}</span>
                            {locale === loc.code && (
                                <Check className="w-4 h-4 text-indigo-500" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
