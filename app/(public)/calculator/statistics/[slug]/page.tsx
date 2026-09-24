import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
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
import { getStatsCalculator, getStatsGroupForCalculator } from "@/lib/calculators"
import { STATS_DETAILS, STATS_CANONICAL_SLUG_MAP, type StatisticsSlug } from "@/lib/calculator-content/statistics"
import { calculatorMetadata } from "@/lib/calculator-content/metadata"

export const dynamicParams = false
export const revalidate = 300

export function generateStaticParams() {
  const allSlugs = Object.keys(STATS_CANONICAL_SLUG_MAP)
  return allSlugs.map((slug) => ({ slug }))
}

const CALCULATOR_COMPONENTS: Record<StatisticsSlug, ComponentType> = {
  "weighted-average-grade": WeightedAverageGradeCalculator,
  "geometric-mean": GeometricMeanCalculator,
  "harmonic-mean": HarmonicMeanCalculator,
  "time-weighted-average": TimeWeightedAverageCalculator,
  "coefficient-of-variance": CoefficientOfVarianceCalculator,
  "pooled-variance": PooledVarianceCalculator,
  "one-way-analysis-of-variance": OneWayAnovaCalculator,
  "two-way-analysis-of-variance": TwoWayAnovaCalculator,
  "z-score-to-percentile": ZScoreToPercentileCalculator,
  "critical-z-value": CriticalZValueCalculator,
  "p-value-from-z-score": PValueFromZScoreCalculator,
  "weighted-average-overtime": WeightedAverageOvertimeCalculator,
  "volume-weighted-average-price": VwapCalculator,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const canonicalSlug = STATS_CANONICAL_SLUG_MAP[slug]
  if (!canonicalSlug) return {}

  const entry = getStatsCalculator(canonicalSlug)
  const detail = STATS_DETAILS[canonicalSlug]
  if (!entry || !detail) return {}

  return calculatorMetadata(
    entry.name,
    detail.metaDescription,
    `/calculator/statistics/${canonicalSlug}/`
  )
}

export default async function StatisticsCalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const canonicalSlug = STATS_CANONICAL_SLUG_MAP[slug]
  if (!canonicalSlug) notFound()

  if (slug !== canonicalSlug) {
    permanentRedirect(`/calculator/statistics/${canonicalSlug}/`)
  }

  const entry = getStatsCalculator(canonicalSlug)
  const detail = STATS_DETAILS[canonicalSlug]
  if (!entry || !detail) notFound()

  const group = getStatsGroupForCalculator(canonicalSlug)
  const Calculator = CALCULATOR_COMPONENTS[canonicalSlug]

  return (
    <CalculatorPage
      category={{ label: "Statistics", href: "/calculator/statistics/" }}
      group={group}
      entry={entry}
      detail={detail}
    >
      <Calculator />
    </CalculatorPage>
  )
}
