import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/store/theme-store'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer"
      aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </button>
  )
}
