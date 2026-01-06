'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
    const themeContext = useTheme()

    // Show placeholder during SSR or before mount
    if (!themeContext || !themeContext.mounted) {
        return (
            <div className="p-2 rounded-full bg-bg-secondary border border-border-color w-8 h-8" />
        )
    }

    const { theme, toggleTheme } = themeContext

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-bg-secondary hover:bg-bg-secondary/80 border border-border-color text-text-secondary hover:text-text-primary transition-all"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
                <Moon className="h-4 w-4 text-indigo-500" />
            )}
        </button>
    )
}
