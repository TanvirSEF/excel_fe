import Link from "next/link"
import Image from "next/image"
import {
  IconArrowRight,
  IconUsers,
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
  { label: "Free Calculators", href: "/calculators", icon: IconCalculator },
]

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
    <section className="relative py-16 sm:py-20 lg:py-24">
      {/* Subtle background grid — very restrained */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">

        {/* ─── Left: Content ─── */}
        <div className="space-y-7">

          {/* Social proof — small, understated */}
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <IconUsers className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Trusted by <strong className="font-semibold text-foreground">40,000+</strong> spreadsheet learners</span>
          </div>

          {/* H1 — clean, no gradient */}
          <h1 className="text-[2.6rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.2rem]">
            Learn Excel &amp; Google Sheets.{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              The practical way.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base text-muted-foreground sm:text-lg leading-relaxed max-w-lg">
            1,600+ step-by-step guides on formulas, shortcuts, VBA automation, Pivot Tables, and business templates. Built for people who actually use spreadsheets.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold h-11 px-5 text-sm"
            >
              <Link href="/blog" className="flex items-center gap-2">
                Browse All Tutorials
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-lg h-11 px-5 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Link href="/pricing" className="flex items-center gap-2">
                <IconFileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                Free Templates
              </Link>
            </Button>
          </div>

          {/* Topic pills — editorial, not decorative */}
          <div className="border-t border-border/60 pt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
              What you&apos;ll find here
            </p>
            <div className="flex flex-wrap gap-2">
              {pills.map((pill) => {
                const Icon = pill.icon
                return (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="flex items-center gap-1.5 rounded-md border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {pill.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* ─── Right: Screenshot ─── */}
        <div className="relative hidden lg:flex items-center justify-center">
          {/* Soft ambient hue — barely visible */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-3xl bg-emerald-500/5 blur-3xl"
          />
          <div className="w-full overflow-hidden rounded-xl border border-border/60 shadow-lg">
            <Image
              src="/hero-spreadsheet.jpg"
              alt="Excel spreadsheet showing XLOOKUP formula in action"
              width={1200}
              height={900}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  )
}
