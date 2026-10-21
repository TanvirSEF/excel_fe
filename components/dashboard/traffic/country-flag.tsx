"use client"

import { IconWorld } from "@tabler/icons-react"

export function getCountryFlag(code?: string | null): string {
  if (!code || code.length !== 2) return "🌐"
  const offset = 127397
  try {
    return String.fromCodePoint(
      ...[...code.toUpperCase()].map((c) => c.charCodeAt(0) + offset)
    )
  } catch {
    return "🌐"
  }
}

interface CountryBadgeProps {
  code?: string | null
  country?: string | null
  city?: string | null
  className?: string
}

export function CountryBadge({
  code,
  country,
  city,
  className = "",
}: CountryBadgeProps) {
  if (!code && !country) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}
      >
        <IconWorld className="h-4 w-4 shrink-0 text-muted-foreground/60" />
        <span>Global / Direct</span>
      </span>
    )
  }

  const flag = getCountryFlag(code)
  const displayName = country || code || "Global"

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
      <span className="text-base leading-none select-none" role="img" aria-label={displayName}>
        {flag}
      </span>
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-foreground truncate max-w-36">
          {displayName}
        </span>
        {city ? (
          <span className="text-[10px] text-muted-foreground truncate max-w-36">
            {city}
          </span>
        ) : null}
      </div>
    </div>
  )
}
