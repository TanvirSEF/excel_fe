import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ComponentType } from "react"
import { IconChevronDown } from "@tabler/icons-react"

import { GeometricMeanCalculator } from "@/components/site/calculators/statistics/geometric-mean-calculator"
import { HarmonicMeanCalculator } from "@/components/site/calculators/statistics/harmonic-mean-calculator"
import {
  CoefficientOfVarianceCalculator,
} from "@/components/site/calculators/statistics/coefficient-of-variance-calculator"
import {
  CriticalZValueCalculator,
} from "@/components/site/calculators/statistics/critical-z-value-calculator"
import {
  OneWayAnovaCalculator,
} from "@/components/site/calculators/statistics/one-way-anova-calculator"
import {
  PValueFromZScoreCalculator,
} from "@/components/site/calculators/statistics/p-value-from-z-score-calculator"
import {
  PooledVarianceCalculator,
} from "@/components/site/calculators/statistics/pooled-variance-calculator"
import {
  TimeWeightedAverageCalculator,
} from "@/components/site/calculators/statistics/time-weighted-average-calculator"
import {
  TwoWayAnovaCalculator,
} from "@/components/site/calculators/statistics/two-way-anova-calculator"
import {
  VwapCalculator,
} from "@/components/site/calculators/statistics/vwap-calculator"
import {
  WeightedAverageGradeCalculator,
} from "@/components/site/calculators/statistics/weighted-average-grade-calculator"
import {
  WeightedAverageOvertimeCalculator,
} from "@/components/site/calculators/statistics/weighted-average-overtime-calculator"
import {
  ZScoreToPercentileCalculator,
} from "@/components/site/calculators/statistics/z-score-to-percentile-calculator"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { STATS_CALCULATORS, getStatsCalculator, getStatsGroupForCalculator } from "@/lib/calculators"
import { STATS_DETAILS, type StatisticsSlug } from "@/lib/stats-calculator-details"

export const dynamicParams = false
export const revalidate = 300

export function generateStaticParams() {
  return STATS_CALCULATORS.map((calculator) => ({ slug: calculator.slug }))
}

const CALCULATOR_COMPONENTS: Record<StatisticsSlug, ComponentType> = {
  "weighted-average-grade-calculator": WeightedAverageGradeCalculator,
  "geometric-mean-calculator": GeometricMeanCalculator,
  "harmonic-mean-calculator": HarmonicMeanCalculator,
  "time-weighted-average-calculator": TimeWeightedAverageCalculator,
  "coefficient-of-variance-calculator": CoefficientOfVarianceCalculator,
  "pooled-variance-calculator": PooledVarianceCalculator,
  "one-way-anova-calculator": OneWayAnovaCalculator,
  "two-way-anova-calculator": TwoWayAnovaCalculator,
  "z-score-to-percentile-calculator": ZScoreToPercentileCalculator,
  "critical-z-value-calculator": CriticalZValueCalculator,
  "p-value-from-z-score-calculator": PValueFromZScoreCalculator,
  "weighted-average-overtime-calculator": WeightedAverageOvertimeCalculator,
  "vwap-calculator": VwapCalculator,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getStatsCalculator(slug)
  const detail = STATS_DETAILS[slug as StatisticsSlug]
  if (!entry || !detail) return {}

  return {
    title: `${entry.name} | Excel Insider`,
    description: detail.metaDescription,
    alternates: { canonical: `/calculators/statistics/${slug}` },
    openGraph: {
      title: `${entry.name} | Excel Insider`,
      description: detail.metaDescription,
      url: `/calculators/statistics/${slug}`,
      images: ["/og-default.png"],
    },
  }
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getStatsCalculator(slug)
  const detail = STATS_DETAILS[slug as StatisticsSlug]
  if (!entry || !detail) notFound()

  const group = getStatsGroupForCalculator(slug)
  const GroupIcon = group.icon
  const Calculator = CALCULATOR_COMPONENTS[slug as StatisticsSlug]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators" },
          { label: "Statistics", href: "/calculators/statistics" },
          { label: entry.name },
        ]}
      />

      <header className="mt-6 max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${group.accent}`}
          >
            <GroupIcon className="h-[22px] w-[22px]" />
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
            {group.title}
          </span>
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {entry.name}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {entry.whatItIs}
        </p>
        <div className="flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
          <p className="text-sm leading-relaxed text-foreground/85">
            {entry.whatToExpect}
          </p>
        </div>
      </header>

      <div className="mt-10">
        <Calculator />
      </div>

      <section className="mt-12 rounded-2xl border border-primary/50 bg-card p-6 shadow-2xs sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          About this calculator
        </h2>

        <div className="mt-5 space-y-3">
          {detail.whenToUse.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Formula
          </p>
          <p className="mt-1.5 font-mono text-sm leading-relaxed text-foreground">
            {detail.formula}
          </p>
        </div>

        <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-foreground">
          How to use it
        </h3>
        <ol className="mt-3 space-y-2.5">
          {detail.howToUse.map((step, index) => (
            <li key={step.slice(0, 40)} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground/85">{step}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-xl border border-border/70 bg-muted/30 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {detail.example.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {detail.example.body}
          </p>
        </div>

        {detail.excelNote ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary/15 bg-primary/5 p-4">
            <p className="text-sm leading-relaxed text-foreground/85">
              <span className="font-semibold text-primary">In Excel: </span>
              {detail.excelNote}
            </p>
          </div>
        ) : null}

        {detail.faqs && detail.faqs.length > 0 ? (
          <div className="mt-8 space-y-4 border-t border-border/60 pt-8">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Frequently asked questions
            </h3>
            {detail.faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-primary/40 bg-muted/20 p-5 transition-all duration-200 open:border-primary/70 hover:border-primary/60"
                {...(index === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-foreground transition-colors group-open:text-primary hover:text-primary">
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:bg-primary/10 group-open:text-primary">
                    <IconChevronDown className="h-4 w-4" />
                  </div>
                </summary>
                <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}
