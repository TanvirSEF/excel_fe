"use client"

import { IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <IconSun className="size-4.4 dark:hidden" stroke={1.75} />
      <IconMoon className="hidden size-4.4 dark:inline" stroke={1.75} />
    </button>
  )
}
