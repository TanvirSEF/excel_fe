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
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card text-xs shadow-lg">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-chart-1/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-chart-2/70" />
        <span className="ml-3 truncate font-mono text-[10px] text-muted-foreground">
          Revenue_Analysis_2025.xlsx
        </span>
      </div>

      {/* Formula bar */}
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/30 px-3 py-2">
        <div className="flex w-10 shrink-0 items-center justify-center rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          B4
        </div>
        <span className="font-mono text-[11px] font-semibold text-primary">fx</span>
        <span className="font-mono text-[11px] text-foreground/80">
          =<span className="text-primary">XLOOKUP</span>
          <span className="text-muted-foreground">(A4, </span>
          <span className="text-chart-3">Months</span>
          <span className="text-muted-foreground">, </span>
          <span className="text-chart-3">Revenue</span>
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
          className={`grid grid-cols-[32px_1fr_96px_72px] border-b border-border/50 text-[11px] last:border-0 ${
            row.active ? "bg-primary/8 font-semibold" : "bg-transparent hover:bg-muted/30"
          }`}
        >
          <div className={`border-r border-border/50 py-2.5 text-center font-mono text-[10px] ${row.active ? "text-primary" : "text-muted-foreground/40"}`}>
            {row.id}
          </div>
          <div className="border-r border-border/50 px-3 py-2.5 text-foreground">
            {row.month}
            {row.active && (
              <span className="ml-2 inline-flex items-center rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                ▶
              </span>
            )}
          </div>
          <div className={`border-r border-border/50 px-3 py-2.5 text-right font-mono ${row.active ? "text-primary" : "text-foreground/80"}`}>
            {row.revenue}
          </div>
          <div className={`px-3 py-2.5 text-right font-mono font-medium ${row.negative ? "text-destructive" : row.active ? "text-primary" : "text-chart-2"}`}>
            {row.growth}
          </div>
        </div>
      ))}

      {/* Status bar */}
      <div className="flex items-center justify-between bg-muted/40 px-4 py-2 text-[10px] text-muted-foreground">
        <span>Sheet1 · 5 rows · Formula verified</span>
        <span className="font-medium text-primary">Excel 365</span>
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
    <section className="relative w-full overflow-hidden bg-card">
      {/* Subtle dot grid — theme-aware */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:28px_28px]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">

        {/* ── Left: Content ── */}
        <div className="space-y-8">

          {/* Trust line */}
          <p className="text-sm font-medium text-muted-foreground">
            Trusted by{" "}
            <span className="font-bold text-foreground">40,000+</span>{" "}
            spreadsheet learners every month
          </p>

          {/* H1 */}
          <h1 className="text-[2.6rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3rem]">
            Excel &amp; Google Sheets
            <br />
            <span className="text-primary">done right.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            1,600+ practical formula guides, VBA automation tutorials, Pivot Table deep-dives, and free business templates — written for real spreadsheet work.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild size="lg" className="h-11 rounded-lg px-6 text-sm font-semibold shadow-none">
              <Link href="/blog" className="flex items-center gap-2">
                Browse Tutorials
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-lg px-5 text-sm font-medium shadow-none"
            >
              <Link href="/pricing" className="flex items-center gap-2">
                <IconFileSpreadsheet className="h-4 w-4" />
                Free Templates
              </Link>
            </Button>
          </div>

          {/* Topic chips */}
          <div className="border-t border-border pt-6 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {pills.map((pill) => {
                const Icon = pill.icon
                return (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {pill.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Right: Excel Mockup ── */}
        <div className="relative">
          <ExcelWindowMockup />
        </div>
      </div>
    </section>
  )
}
