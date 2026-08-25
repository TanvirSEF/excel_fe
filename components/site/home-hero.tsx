import Link from "next/link"
import {
  IconArrowRight,
  IconFileSpreadsheet,
  IconMathFunction,
  IconTable,
  IconCode,
  IconChartBar,
  IconCalculator,
  IconStarFilled,
} from "@tabler/icons-react"

import type { Category } from "@/types/api"
import { Button } from "@/components/ui/button"
import { HeroSpreadsheetCard } from "@/components/site/hero-spreadsheet-card"

const FEATURED_PILLS = [
  { label: "Excel Formulas", href: "/blog", icon: IconMathFunction },
  { label: "Google Sheets", href: "/blog", icon: IconTable },
  { label: "VBA & Macros", href: "/blog", icon: IconCode },
  { label: "Charts & Visuals", href: "/blog", icon: IconChartBar },
  { label: "Free Calculators", href: "/calculators", icon: IconCalculator },
]

export function HomeHero({ categories }: { categories: Category[] }) {
  const displayPills =
    categories.length > 0
      ? categories.slice(0, 5).map((c) => ({
          label: c.name,
          href: `/categories/${c.slug}`,
          icon: IconMathFunction,
        }))
      : FEATURED_PILLS

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
      {/* Background Decorative Mesh & Radial Gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[450px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15" />

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Headline, Value Proposition, Dual CTAs & Quick Pills */}
        <div className="space-y-6 text-left lg:col-span-7">
          {/* Trust Proof Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-2xs backdrop-blur-xs">
            <IconStarFilled className="h-3.5 w-3.5 text-amber-500" />
            <span>Over 1,600+ Free Guides & Excel Tutorials</span>
          </div>

          {/* High-Impact SEO H1 Headline */}
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.12]">
            Master Excel &amp; Google Sheets{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400">
              Like a Pro
            </span>
          </h1>

          {/* Subtitle Value Proposition */}
          <p className="text-pretty text-base text-muted-foreground sm:text-lg leading-relaxed max-w-2xl">
            Learn formulas, shortcuts, and VBA automation with practical step-by-step guides. Solve complex spreadsheet problems, use interactive calculators, and download free business templates.
          </p>

          {/* Dual Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold shadow-md px-6 h-12 text-sm transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <Link href="/blog" className="flex items-center gap-2">
                <span>Explore 1,600+ Tutorials</span>
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-border/80 bg-background/80 hover:bg-muted text-foreground font-medium px-6 h-12 text-sm backdrop-blur-xs transition-all hover:scale-[1.02]"
            >
              <Link href="/pricing" className="flex items-center gap-2">
                <IconFileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Free Templates</span>
              </Link>
            </Button>
          </div>

          {/* Quick-Pills Filter Bar (ExcelDemy Style) */}
          <div className="pt-4 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Popular Learning Topics:
            </p>
            <div className="flex flex-wrap gap-2">
              {displayPills.map((pill) => {
                const Icon = pill.icon
                return (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="group flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground transition-all duration-150 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    <span>{pill.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: High-End Live Spreadsheet Visual Card */}
        <div className="flex items-center justify-center lg:col-span-5">
          <HeroSpreadsheetCard />
        </div>
      </div>
    </section>
  )
}
