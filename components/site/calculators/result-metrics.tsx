import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface GradientHeroMetricProps {
  label: string
  value: string
  sub?: string
  className?: string
}

/** The single most important result, on the brand gradient. */
export function GradientHeroMetric({
  label,
  value,
  sub,
  className,
}: GradientHeroMetricProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-chart-2 via-primary to-chart-5 p-5 text-primary-foreground shadow-lg",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/75">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">
        {value}
      </p>
      {sub ? (
        <p className="mt-1 text-xs text-primary-foreground/75">{sub}</p>
      ) : null}
    </div>
  )
}

interface MetricTileProps {
  label: string
  value: string
  sub?: string
}

export function MetricTile({ label, value, sub }: MetricTileProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg font-bold tabular-nums text-foreground">
        {value}
      </p>
      {sub ? (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>
      ) : null}
    </div>
  )
}

interface ResultsPlaceholderProps {
  title?: string
  description?: string
}

export function ResultsPlaceholder({
  title = "Results appear here",
  description = "Enter valid values to see live results.",
}: ResultsPlaceholderProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

/** Wraps the live results region so screen readers announce updates. */
export function ResultsRegion({ children }: { children: ReactNode }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      {children}
    </div>
  )
}
