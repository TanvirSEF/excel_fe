import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { SectionHeading } from "@/components/site/section-heading"
import { ACCOUNTING_HUB, FINANCE_HUB, STATS_HUB } from "@/lib/calculators"

export const revalidate = 300

const HUBS = [STATS_HUB, FINANCE_HUB, ACCOUNTING_HUB]

export const metadata: Metadata = {
  title: "Free Online Calculators | Excel Insider",
  description:
    "45 free calculators for statistics, finance and accounting — ANOVA, IRR, dividend DRIP, payroll, debt payoff and more. Instant, private, no signup.",
  alternates: { canonical: "/calculators" },
  openGraph: {
    title: "Free Online Calculators | Excel Insider",
    description:
      "Statistics, finance and accounting calculators — instant results, formulas explained, 100% free.",
    url: "/calculators",
    images: ["/og-default.png"],
  },
}

export default function CalculatorsPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <SectionHeading
        badge="45 Free Tools"
        title="Every Excel Insider calculator"
        subtitle="Three libraries of instant, browser-based calculators — every formula explained, every result step by step. Nothing is stored, nothing is charged."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {HUBS.map((hub) => {
          const Icon = hub.groups[0].icon
          const count = hub.groups.reduce(
            (total, group) => total + group.calculators.length,
            0
          )
          return (
            <Link
              key={hub.slug}
              href={`/calculators/${hub.slug}`}
              className="group flex flex-col rounded-2xl border border-primary/50 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/80 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${hub.groups[0].accent}`}
                >
                  <Icon className="h-[22px] w-[22px]" />
                </div>
                <IconArrowRight className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h2 className="mt-4 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {hub.title} {hub.titleAccent}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {hub.groups[0].tagline}
              </p>
              <div className="mt-auto pt-4">
                <span className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
                  {count} calculators · {hub.groups.length} categories
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
