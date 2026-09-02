import Link from "next/link"
import {
  IconArrowUpRight,
  IconBuildingBank,
  IconCalendarTime,
  IconPercentage,
  IconTrendingUp,
} from "@tabler/icons-react"

import { SectionHeading } from "@/components/site/section-heading"

const CALCULATORS = [
  {
    title: "Loan & EMI Amortization",
    slug: "loan-emi",
    description:
      "Calculate monthly EMI payments, total interest breakdown, and generate printable principal amortization tables.",
    icon: IconBuildingBank,
    formulaSnippet: "=PMT(rate/12, nper, -pv)",
    badge: "Financial",
    href: "/calculators",
  },
  {
    title: "Workday & Date Difference",
    slug: "date-difference",
    description:
      "Count exact working business days between two dates, automatically excluding weekends and regional public holidays.",
    icon: IconCalendarTime,
    formulaSnippet: "=NETWORKDAYS(start, end, holidays)",
    badge: "Date & Time",
    href: "/calculators",
  },
  {
    title: "CAGR & Investment Growth",
    slug: "cagr-calculator",
    description:
      "Measure Compound Annual Growth Rate and projected multi-year returns for business revenue and investment assets.",
    icon: IconTrendingUp,
    formulaSnippet: "=(End_Val / Start_Val)^(1/N) - 1",
    badge: "Growth & Analytics",
    href: "/calculators",
  },
  {
    title: "Profit Margin & Markup",
    slug: "profit-margin",
    description:
      "Quickly compute gross profit margin percentage, cost markup multiplier, and target pricing revenue thresholds.",
    icon: IconPercentage,
    formulaSnippet: "Margin = (Price - Cost) / Price",
    badge: "Pricing & Sales",
    href: "/calculators",
  },
]

export function CalculatorsShowcase() {
  return (
    <section id="calculators" className="scroll-mt-20 py-12 sm:py-16">
      <SectionHeading
        badge="Instant Free Tools"
        title="Interactive Spreadsheet Calculators"
        subtitle="Perform quick financial calculations, date difference analysis, and growth modeling right in your browser."
        action={{ label: "View all calculators", href: "/calculators" }}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CALCULATORS.map((calc) => {
          const Icon = calc.icon
          return (
            <Link
              key={calc.title}
              href={calc.href}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="space-y-3.5">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {calc.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {calc.title}
                </h3>

                {/* Description */}
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {calc.description}
                </p>

                {/* Formula Snippet Box */}
                <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 font-mono text-[11px] text-foreground/80 transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
                  <span className="text-primary font-semibold">fx </span>
                  <span className="truncate">{calc.formulaSnippet}</span>
                </div>
              </div>

              {/* Action Indicator */}
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                <span>Launch tool</span>
                <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
