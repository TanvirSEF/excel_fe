import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ComponentType } from "react"

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
import { CalculatorPage } from "@/components/site/calculators/calculator-page"
import { STATS_CALCULATORS, getStatsCalculator, getStatsGroupForCalculator } from "@/lib/calculators"
import { STATS_DETAILS, type StatisticsSlug } from "@/lib/calculator-content/statistics"
import { calculatorMetadata } from "@/lib/calculator-content/metadata"

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

  return calculatorMetadata(
    entry.name,
    detail.metaDescription,
    `/calculators/statistics/${slug}`
  )
}

export default async function StatisticsCalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getStatsCalculator(slug)
  const detail = STATS_DETAILS[slug as StatisticsSlug]
  if (!entry || !detail) notFound()

  const group = getStatsGroupForCalculator(slug)
  const Calculator = CALCULATOR_COMPONENTS[slug as StatisticsSlug]

  return (
    <CalculatorPage
      category={{ label: "Statistics", href: "/calculators/statistics" }}
      group={group}
      entry={entry}
      detail={detail}
    >
      <Calculator />
    </CalculatorPage>
  )
}
