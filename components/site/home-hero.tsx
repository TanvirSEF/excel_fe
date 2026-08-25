import Link from "next/link"
import {
  IconArrowRight,
  IconFileSpreadsheet,
  IconMathFunction,
  IconTable,
  IconCode,
  IconChartBar,
  IconCalculator,
} from "@tabler/icons-react"

import type { Category } from "@/types/api"
import { Button } from "@/components/ui/button"

const FALLBACK_PILLS = [
  { label: "Excel Formulas", href: "/blog", icon: IconMathFunction },
  { label: "Google Sheets", href: "/blog", icon: IconTable },
  { label: "VBA & Macros", href: "/blog", icon: IconCode },
  { label: "Charts & Dashboards", href: "/blog", icon: IconChartBar },
  { label: "Calculators", href: "/calculators", icon: IconCalculator },
]

const SPREADSHEET_ROWS = [
  { id: 2, month: "January",  revenue: "$12,400", growth: "8.2%",  negative: false, active: false },
  { id: 3, month: "February", revenue: "$15,800", growth: "11.4%", negative: false, active: false },
  { id: 4, month: "March",    revenue: "$19,350", growth: "22.5%", negative: false, active: true  },
  { id: 5, month: "April",    revenue: "$17,900", growth: "–7.5%", negative: true,  active: false },
  { id: 6, month: "May",      revenue: "$23,120", growth: "29.2%", negative: false, active: false },
]

function ExcelWindowMockup() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-primary-foreground/20 bg-primary-foreground text-xs shadow-xl">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-chart-1/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
        <span className="ml-3 truncate font-mono text-[10px] text-muted-foreground">
          Revenue_Analysis_2025.xlsx
        </span>
      </div>

      {/* Formula bar */}
      <div className="flex items-center gap-1.5 border-b border-border bg-background px-3 py-2">
        <div className="flex w-10 shrink-0 items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          B4
        </div>
        <span className="font-mono text-[11px] font-bold text-primary">fx</span>
        <span className="font-mono text-[11px] text-foreground/80">
          =<span className="text-primary">XLOOKUP</span>
          <span className="text-muted-foreground">(A4, </span>
          <span className="text-chart-2">Months</span>
          <span className="text-muted-foreground">, </span>
          <span className="text-chart-2">Revenue</span>
          <span className="text-muted-foreground">)</span>
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[32px_1fr_96px_72px] border-b border-border bg-muted/40 text-[10px] font-semibold tracking-wide text-muted-foreground">
        <div className="border-r border-border py-1.5 text-center">#</div>
        <div className="border-r border-border px-3 py-1.5">Month</div>
        <div className="border-r border-border px-3 py-1.5 text-right">Revenue</div>
        <div className="px-3 py-1.5 text-right">Growth</div>
      </div>

      {/* Data rows */}
      {SPREADSHEET_ROWS.map((row) => (
        <div
          key={row.id}
          className={`grid grid-cols-[32px_1fr_96px_72px] border-b border-border/50 text-[11px] last:border-0 transition-colors ${
            row.active ? "bg-primary/8 font-medium" : "bg-background hover:bg-muted/30"
          }`}
        >
          <div className={`border-r border-border/50 py-2.5 text-center font-mono text-[10px] ${row.active ? "font-bold text-primary" : "text-muted-foreground/40"}`}>
            {row.id}
          </div>
          <div className={`border-r border-border/50 px-3 py-2.5 ${row.active ? "font-semibold text-foreground" : "text-foreground/80"}`}>
            {row.month}
            {row.active && (
              <span className="ml-2 inline-flex items-center rounded bg-primary/12 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                active
              </span>
            )}
          </div>
          <div className={`border-r border-border/50 px-3 py-2.5 text-right font-mono ${row.active ? "font-bold text-primary" : "text-foreground/80"}`}>
            {row.revenue}
          </div>
          <div className={`px-3 py-2.5 text-right font-mono font-medium ${row.negative ? "text-destructive" : row.active ? "font-bold text-primary" : "text-chart-2"}`}>
            {row.growth}
          </div>
        </div>
      ))}

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-[10px] text-muted-foreground">
        <span>Sheet1 · 5 rows · Formula verified</span>
        <span className="font-semibold text-primary">Excel 365</span>
      </div>
    </div>
  )
}

export function HomeHero({ categories }: { categories: Category[] }) {
  const pills =
    categories.length > 0
      ? categories.slice(0, 5).map((c) => ({
          label: c.name,
          href: `/categories/${c.slug}`,
          icon: IconMathFunction,
        }))
      : FALLBACK_PILLS

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-chart-2 via-primary to-chart-5">
      {/* Large glow — top right */}
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[580px] w-[580px] rounded-full bg-white/10 blur-3xl" />
      {/* Medium glow — center left */}
      <div aria-hidden className="pointer-events-none absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/6 blur-3xl" />
      {/* Small glow — bottom right */}
      <div aria-hidden className="pointer-events-none absolute -bottom-16 right-1/4 h-48 w-48 rounded-full bg-white/8 blur-2xl" />
      {/* Diagonal shine streak */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
      {/* Bottom fade into page */}
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/15 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">

        {/* ── Left: Content ── */}
        <div className="space-y-8">

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-medium text-primary-foreground/90">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/70" />
            Trusted by 40,000+ spreadsheet learners
          </div>

          {/* H1 */}
          <h1 className="text-[2.6rem] font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl lg:text-[3rem]">
            Excel &amp; Google Sheets
            <br />
            <span className="opacity-90">done right.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-md text-base leading-relaxed text-primary-foreground/75 sm:text-lg">
            1,600+ practical formula guides, VBA automation tutorials, Pivot Table deep-dives, and free business templates — all written for real spreadsheet work.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-lg bg-primary-foreground px-6 text-sm font-semibold text-primary hover:bg-primary-foreground/90 shadow-none"
            >
              <Link href="/blog" className="flex items-center gap-2">
                Browse Tutorials
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-lg border-primary-foreground/30 bg-transparent px-5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 shadow-none"
            >
              <Link href="/pricing" className="flex items-center gap-2">
                <IconFileSpreadsheet className="h-4 w-4" />
                Free Templates
              </Link>
            </Button>
          </div>

          {/* Topic chips */}
          <div className="border-t border-primary-foreground/15 pt-6 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-foreground/50">
              Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {pills.map((pill) => {
                const Icon = pill.icon
                return (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="flex items-center gap-1.5 rounded-md border border-primary-foreground/20 bg-primary-foreground/8 px-3 py-1.5 text-[11px] font-medium text-primary-foreground/75 transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15 hover:text-primary-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {pill.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Right: Excel Mockup — hidden on mobile ── */}
        <div className="hidden lg:block">
          <ExcelWindowMockup />
        </div>
      </div>
    </section>
  )
}
