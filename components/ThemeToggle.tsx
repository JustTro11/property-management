'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
    const themeContext = useTheme()

    // Show placeholder during SSR or before mount
    if (!themeContext || !themeContext.mounted) {
        return (
            <div className="p-2 rounded-full bg-zinc-800/50 border border-zinc-700 w-8 h-8" />
        )
    }

    const { theme, toggleTheme } = themeContext

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-zinc-800/50 dark:bg-white/10 hover:bg-zinc-700/50 dark:hover:bg-white/20 border border-zinc-700 dark:border-white/10 transition-all"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
                <Moon className="h-4 w-4 text-indigo-500" />
            )}
        </button>
    )
}
