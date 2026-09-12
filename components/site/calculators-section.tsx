import Link from "next/link"
import {
  IconArrowRight,
  IconChartHistogram,
  IconChevronRight,
  IconReportMoney,
  IconScale,
} from "@tabler/icons-react"

import { SectionHeading } from "@/components/site/section-heading"
import { ACCOUNTING_HUB, FINANCE_HUB, STATS_HUB } from "@/lib/calculators"

interface FeaturedTool {
  name: string
  slug: string
}

interface DomainCard {
  id: string
  title: string
  category: string
  description: string
  hubHref: string
  icon: typeof IconReportMoney
  count: number
  accentBg: string
  accentText: string
  accentBorder: string
  badgeClass: string
  tools: FeaturedTool[]
}

const DOMAIN_CARDS: DomainCard[] = [
  {
    id: "finance",
    title: "Financial & Investment",
    category: "Finance Hub",
    description:
      "Model investment yields, calculate Internal Rate of Return (IRR), DRIP compounding, and analyze rental property ROI.",
    hubHref: "/calculators/finance",
    icon: IconReportMoney,
    count: FINANCE_HUB.groups.reduce((acc, g) => acc + g.calculators.length, 0),
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-emerald-500/30 group-hover:border-emerald-500/60",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    tools: [
      {
        name: "Internal Rate of Return (IRR)",
        slug: "irr-calculator",
      },
      {
        name: "Dividend Reinvestment (DRIP)",
        slug: "dividend-reinvestment-plan-calculator",
      },
      {
        name: "Rental Property ROI",
        slug: "rental-property-roi-calculator",
      },
      {
        name: "Stock Profit & Loss",
        slug: "share-profit-calculator",
      },
    ],
  },
  {
    id: "accounting",
    title: "Accounting & Business",
    category: "Accounting Hub",
    description:
      "Calculate retail margins, working capital cycles, overtime wages, and tiered sales commission schedules.",
    hubHref: "/calculators/accounting",
    icon: IconScale,
    count: ACCOUNTING_HUB.groups.reduce((acc, g) => acc + g.calculators.length, 0),
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-600 dark:text-blue-400",
    accentBorder: "border-blue-500/30 group-hover:border-blue-500/60",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    tools: [
      {
        name: "Retail Profit Margin",
        slug: "retail-profit-margin-calculator",
      },
      {
        name: "Payroll & Overtime Wages",
        slug: "payroll-overtime-calculator",
      },
      {
        name: "Cash Conversion Cycle",
        slug: "cash-conversion-cycle-calculator",
      },
      {
        name: "Sales Commission Tier",
        slug: "sales-commission-calculator",
      },
    ],
  },
  {
    id: "statistics",
    title: "Statistics & Probability",
    category: "Statistics Hub",
    description:
      "Run one-way ANOVA hypothesis tests, convert Z-scores to percentiles, and calculate weighted averages and geometric means.",
    hubHref: "/calculators/statistics",
    icon: IconChartHistogram,
    count: STATS_HUB.groups.reduce((acc, g) => acc + g.calculators.length, 0),
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-600 dark:text-violet-400",
    accentBorder: "border-violet-500/30 group-hover:border-violet-500/60",
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    tools: [
      {
        name: "Weighted Average Grade",
        slug: "weighted-average-grade-calculator",
      },
      {
        name: "One-Way ANOVA Test",
        slug: "one-way-anova-calculator",
      },
      {
        name: "Z-Score to Percentile",
        slug: "z-score-to-percentile-calculator",
      },
      {
        name: "Geometric Mean Rate",
        slug: "geometric-mean-calculator",
      },
    ],
  },
]

export function CalculatorsSection() {
  return (
    <section className="py-12 sm:py-16">
      <SectionHeading
        badge="45 Free Tools"
        title="Instant Browser-Based Calculators"
        subtitle="Three libraries of instant, browser-based calculators for statistics, finance, and accounting — every formula explained, every result step by step."
        action={{ label: "View All 45 Calculators", href: "/calculators" }}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DOMAIN_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              className={`group flex flex-col justify-between rounded-2xl border ${card.accentBorder} bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.accentBg} ${card.accentText}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${card.badgeClass}`}
                  >
                    {card.count} Free Tools
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {card.category}
                  </p>
                  <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {card.title}
                  </h3>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {card.description}
                </p>

                <div className="mt-5 space-y-1.5 pt-4 border-t border-border/50">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
                    Popular Calculators
                  </p>
                  {card.tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`${card.hubHref}/${tool.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 hover:text-primary transition-colors group/item"
                    >
                      <span className="truncate group-hover/item:translate-x-0.5 transition-transform">
                        {tool.name}
                      </span>
                      <IconChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover/item:text-primary transition-colors shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/50">
                <Link
                  href={card.hubHref}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${card.accentText} hover:underline`}
                >
                  <span>Explore all {card.title} tools</span>
                  <IconArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
