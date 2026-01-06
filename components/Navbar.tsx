'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Home as HomeIcon, Globe } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Link, usePathname, useRouter } from '@/lib/navigation'
import { useTranslations, useLocale } from 'next-intl'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const t = useTranslations('Navigation')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: e.target.value })
  }

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <HomeIcon className="h-6 w-6 text-indigo-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                LuxeLiving
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {t('home')}
              </Link>
              <Link href="/properties" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {t('properties')}
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {t('about')}
              </Link>

              <div className="flex items-center space-x-2 text-gray-300 bg-white/5 py-1 px-3 rounded-full border border-white/10">
                <Globe className="h-3.5 w-3.5" />
                <select
                  onChange={handleLocaleChange}
                  defaultValue={locale}
                  className="bg-transparent text-sm focus:outline-none cursor-pointer appearance-none pr-2"
                >
                  <option value="en" className="bg-black">English</option>
                  <option value="es" className="bg-black">Español</option>
                  <option value="zh" className="bg-black">中文</option>
                </select>
              </div>

              {session ? (
                <>
                  <Link href="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
                  {t('login')}
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
              {t('home')}
            </Link>
            <Link href="/properties" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
              {t('properties')}
            </Link>
            <Link href="/about" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
              {t('about')}
            </Link>

            <div className="px-3 py-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Globe className="h-5 w-5" />
                <select
                  onChange={handleLocaleChange}
                  defaultValue={locale}
                  className="bg-transparent text-base focus:outline-none w-full"
                >
                  <option value="en" className="bg-black">English</option>
                  <option value="es" className="bg-black">Español</option>
                  <option value="zh" className="bg-black">中文</option>
                </select>
              </div>
            </div>

            {session ? (
              <>
                <Link href="/admin" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
