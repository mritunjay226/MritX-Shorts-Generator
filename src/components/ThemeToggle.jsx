'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { MoonStar, SunMedium } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Global light/dark theme toggle.
 *
 * Uses next-themes and tailwind CSS variables defined in globals.css.
 * Placed in all main headers (marketing + dashboard).
 */
const ThemeToggle = ({ className }) => {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Avoid hydration mismatch: render a neutral placeholder button.
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'relative h-9 w-9 rounded-full border border-border bg-background/80 backdrop-blur text-foreground shadow-sm',
          className,
        )}
        aria-label="Toggle theme"
      >
        <SunMedium className="h-4 w-4" />
      </Button>
    )
  }

  const resolved = theme === 'system' ? systemTheme : theme
  const isDark = resolved === 'dark'

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className={cn(
        'relative h-9 w-9 rounded-full border border-border bg-background/80 backdrop-blur shadow-sm transition-colors',
        'hover:bg-accent/70 hover:text-accent-foreground',
        'dark:bg-black/60 dark:hover:bg-zinc-800',
        className,
      )}
      aria-label="Toggle theme"
    >
      {/* Sun for light mode */}
      <SunMedium
        className={cn(
          'h-4 w-4 text-yellow-500 transition-all duration-300',
          isDark ? 'scale-0 opacity-0 -rotate-90' : 'scale-100 opacity-100 rotate-0',
        )}
      />
      {/* Moon for dark mode */}
      <MoonStar
        className={cn(
          'absolute h-4 w-4 text-blue-400 transition-all duration-300',
          isDark ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-90',
        )}
      />
    </Button>
  )
}

export default ThemeToggle