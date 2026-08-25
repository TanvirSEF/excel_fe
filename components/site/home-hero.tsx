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
    <div className="w-full overflow-hidden rounded-xl border border-[var(--hero-border)] bg-[var(--hero-surface)] text-xs shadow-2xl">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--hero-border)] bg-[var(--hero-surface-raised)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--hero-accent)]" />
        <span className="ml-3 truncate font-mono text-[10px] text-[var(--hero-muted)]">
          Revenue_Analysis_2025.xlsx
        </span>
      </div>

      {/* Formula bar */}
      <div className="flex items-center gap-1.5 border-b border-[var(--hero-border)] bg-[var(--hero-bg)] px-3 py-2">
        <div className="flex w-10 shrink-0 items-center justify-center rounded border border-[var(--hero-border)] bg-[var(--hero-surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--hero-muted)]">
          B4
        </div>
        <span className="font-mono text-[11px] font-bold text-[var(--hero-accent)]">fx</span>
        <span className="font-mono text-[11px] text-[var(--hero-foreground)]/80">
          =<span className="text-[var(--hero-accent)]">XLOOKUP</span>
          <span className="text-[var(--hero-muted)]">(A4, </span>
          <span className="text-amber-400/90">Months</span>
          <span className="text-[var(--hero-muted)]">, </span>
          <span className="text-amber-400/90">Revenue</span>
          <span className="text-[var(--hero-muted)]">)</span>
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[32px_1fr_96px_72px] border-b border-[var(--hero-border)] bg-[var(--hero-surface-raised)] text-[10px] font-semibold tracking-wide text-[var(--hero-muted)]">
        <div className="border-r border-[var(--hero-border)] py-1.5 text-center">#</div>
        <div className="border-r border-[var(--hero-border)] px-3 py-1.5">Month</div>
        <div className="border-r border-[var(--hero-border)] px-3 py-1.5 text-right">Revenue</div>
        <div className="px-3 py-1.5 text-right">Growth</div>
      </div>

      {/* Data rows */}
      {SPREADSHEET_ROWS.map((row) => (
        <div
          key={row.id}
          className={`grid grid-cols-[32px_1fr_96px_72px] border-b border-[var(--hero-border)] text-[11px] last:border-0 transition-colors ${
            row.active
              ? "bg-[var(--hero-accent-muted)]"
              : "bg-transparent hover:bg-[var(--hero-surface-raised)]/60"
          }`}
        >
          <div className={`border-r border-[var(--hero-border)] py-2.5 text-center font-mono text-[10px] ${row.active ? "font-bold text-[var(--hero-accent)]" : "text-[var(--hero-muted)]"}`}>
            {row.id}
          </div>
          <div className={`border-r border-[var(--hero-border)] px-3 py-2.5 ${row.active ? "font-semibold text-[var(--hero-foreground)]" : "text-[var(--hero-foreground)]/70"}`}>
            {row.month}
            {row.active && (
              <span className="ml-2 inline-flex items-center rounded bg-[var(--hero-accent-muted)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--hero-accent)]">
                active
              </span>
            )}
          </div>
          <div className={`border-r border-[var(--hero-border)] px-3 py-2.5 text-right font-mono ${row.active ? "font-bold text-[var(--hero-accent)]" : "text-[var(--hero-foreground)]/70"}`}>
            {row.revenue}
          </div>
          <div className={`px-3 py-2.5 text-right font-mono font-medium ${row.negative ? "text-red-400" : row.active ? "font-bold text-[var(--hero-accent)]" : "text-[var(--hero-accent)]/60"}`}>
            {row.growth}
          </div>
        </div>
      ))}

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-[var(--hero-border)] bg-[var(--hero-bg)] px-4 py-2 text-[10px] text-[var(--hero-muted)]">
        <span>Sheet1 · 5 rows · Formula verified</span>
        <span className="font-semibold text-[var(--hero-accent)]">Excel 365</span>
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
    <section className="relative w-full overflow-hidden bg-[var(--hero-bg)]">
      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(var(--hero-border)_1px,transparent_1px)] [background-size:28px_28px]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">

        {/* ── Left: Content ── */}
        <div className="space-y-8">

          {/* Trust line */}
          <p className="text-sm font-medium text-[var(--hero-muted)]">
            Trusted by{" "}
            <span className="font-bold text-[var(--hero-foreground)]">40,000+</span>{" "}
            spreadsheet learners every month
          </p>

          {/* H1 */}
          <h1 className="text-[2.6rem] font-bold leading-[1.1] tracking-tight text-[var(--hero-foreground)] sm:text-5xl lg:text-[3rem]">
            Excel &amp; Google Sheets
            <br />
            <span className="text-[var(--hero-accent)]">done right.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-md text-base leading-relaxed text-[var(--hero-muted)] sm:text-lg">
            1,600+ practical formula guides, VBA automation tutorials, Pivot Table deep-dives, and free business templates — all written for real spreadsheet work.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-lg bg-[var(--hero-accent)] px-6 text-sm font-semibold text-[var(--hero-bg)] hover:bg-[var(--hero-accent)]/90 shadow-none"
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
              className="h-11 rounded-lg border-[var(--hero-border)] bg-transparent px-5 text-sm font-medium text-[var(--hero-muted)] hover:border-[var(--hero-accent)]/40 hover:bg-[var(--hero-accent-muted)] hover:text-[var(--hero-foreground)] shadow-none"
            >
              <Link href="/pricing" className="flex items-center gap-2">
                <IconFileSpreadsheet className="h-4 w-4" />
                Free Templates
              </Link>
            </Button>
          </div>

          {/* Topic chips */}
          <div className="border-t border-[var(--hero-border)] pt-6 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--hero-muted)]">
              Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {pills.map((pill) => {
                const Icon = pill.icon
                return (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="flex items-center gap-1.5 rounded-md border border-[var(--hero-border)] bg-[var(--hero-surface)] px-3 py-1.5 text-[11px] font-medium text-[var(--hero-muted)] transition-colors hover:border-[var(--hero-accent)]/40 hover:bg-[var(--hero-accent-muted)] hover:text-[var(--hero-accent)]"
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
