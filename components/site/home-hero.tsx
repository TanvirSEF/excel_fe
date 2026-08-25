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
  { id: 2, month: "January", revenue: "$12,400", growth: "8.2%", active: false },
  { id: 3, month: "February", revenue: "$15,800", growth: "11.4%", active: false },
  { id: 4, month: "March", revenue: "$19,350", growth: "22.5%", active: true },
  { id: 5, month: "April", revenue: "$17,900", growth: "–7.5%", active: false },
  { id: 6, month: "May", revenue: "$23,120", growth: "29.2%", active: false },
]

function ExcelWindowMockup() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] text-xs shadow-2xl ring-1 ring-black/40">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#2a2a2a] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate font-mono text-[11px] text-white/40">
          Revenue_Analysis_2025.xlsx
        </span>
      </div>

      {/* Toolbar strip */}
      <div className="flex items-center gap-0 border-b border-white/[0.06] bg-[#252525]">
        <div className="flex w-[52px] shrink-0 items-center justify-center border-r border-white/[0.06] px-3 py-2 font-mono text-[10px] text-white/40">
          B4
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2">
          <span className="font-mono text-[10px] font-semibold text-emerald-400">fx</span>
          <span className="font-mono text-[10px] text-white/80">
            =<span className="text-sky-400">XLOOKUP</span>
            <span className="text-white/50">(A4, </span>
            <span className="text-amber-400">Months</span>
            <span className="text-white/50">, </span>
            <span className="text-amber-400">Revenue</span>
            <span className="text-white/50">)</span>
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[36px_1fr_100px_80px] border-b border-white/[0.06] bg-[#2a2a2a] text-[10px] font-semibold tracking-wide text-white/30">
        <div className="border-r border-white/[0.06] py-1.5 text-center">#</div>
        <div className="border-r border-white/[0.06] px-3 py-1.5">A — Month</div>
        <div className="border-r border-white/[0.06] px-3 py-1.5 text-right">B — Revenue</div>
        <div className="px-3 py-1.5 text-right">C — Growth</div>
      </div>

      {/* Data rows */}
      {SPREADSHEET_ROWS.map((row) => (
        <div
          key={row.id}
          className={`grid grid-cols-[36px_1fr_100px_80px] border-b border-white/[0.04] text-[11px] transition-colors ${row.active
              ? "bg-emerald-500/10 text-white"
              : "bg-transparent text-white/60 hover:bg-white/[0.03]"
            }`}
        >
          <div
            className={`border-r border-white/[0.04] py-2.5 text-center font-mono ${row.active ? "text-emerald-400" : "text-white/20"
              }`}
          >
            {row.id}
          </div>
          <div className={`border-r border-white/[0.04] px-3 py-2.5 font-medium ${row.active ? "text-white" : ""}`}>
            {row.month}
            {row.active && (
              <span className="ml-2 inline-flex items-center rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-400">
                Active
              </span>
            )}
          </div>
          <div
            className={`border-r border-white/[0.04] px-3 py-2.5 text-right font-mono ${row.active ? "text-emerald-300 font-bold" : ""
              }`}
          >
            {row.revenue}
          </div>
          <div
            className={`px-3 py-2.5 text-right font-mono font-medium ${row.growth.startsWith("–")
                ? "text-red-400"
                : row.active
                  ? "text-emerald-400 font-bold"
                  : "text-emerald-500/70"
              }`}
          >
            {row.growth}
          </div>
        </div>
      ))}

      {/* Status bar */}
      <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-2 text-[10px] text-white/25">
        <span>Sheet1 · 5 rows · Formula verified</span>
        <span className="text-emerald-500/60 font-medium">Excel 365</span>
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
    <section className="relative w-full overflow-hidden bg-emerald-950">
      {/* Subtle dot grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #6ee7b7 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial vignette to fade the grid at edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #022c22 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">

        {/* ── Left: Content ── */}
        <div className="space-y-8">
          {/* Trust line */}
          <p className="text-sm font-medium text-emerald-400/80">
            Trusted by <span className="font-bold text-emerald-300">40,000+</span> spreadsheet learners every month
          </p>

          {/* Headline */}
          <h1 className="text-[2.6rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3rem]">
            Excel & Google Sheets
            <br />
            <span className="text-emerald-400">done right.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-md text-base leading-relaxed text-emerald-100/60 sm:text-lg">
            1,600+ practical formula guides, VBA automation tutorials, Pivot Table deep-dives, and free business templates — all written for real spreadsheet work.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-lg bg-emerald-500 px-6 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 shadow-none"
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
              className="h-11 rounded-lg border-white/15 bg-transparent px-5 text-sm font-medium text-white/70 hover:border-white/30 hover:bg-white/5 hover:text-white shadow-none"
            >
              <Link href="/pricing" className="flex items-center gap-2">
                <IconFileSpreadsheet className="h-4 w-4" />
                Free Templates
              </Link>
            </Button>
          </div>

          {/* Topic chips */}
          <div className="border-t border-white/10 pt-6 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400/50">
              Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {pills.map((pill) => {
                const Icon = pill.icon
                return (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/60 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {pill.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Right: Excel Window ── */}
        <div className="relative">
          <ExcelWindowMockup />
        </div>
      </div>
    </section>
  )
}
