import type { CalculatorDetail } from "../types"

import { weightedAverageGradeCalculator } from "./weighted-average-grade-calculator"
import { geometricMeanCalculator } from "./geometric-mean-calculator"
import { harmonicMeanCalculator } from "./harmonic-mean-calculator"
import { timeWeightedAverageCalculator } from "./time-weighted-average-calculator"
import { coefficientOfVarianceCalculator } from "./coefficient-of-variance-calculator"
import { pooledVarianceCalculator } from "./pooled-variance-calculator"
import { oneWayAnovaCalculator } from "./one-way-anova-calculator"
import { twoWayAnovaCalculator } from "./two-way-anova-calculator"
import { zScoreToPercentileCalculator } from "./z-score-to-percentile-calculator"
import { criticalZValueCalculator } from "./critical-z-value-calculator"
import { pValueFromZScoreCalculator } from "./p-value-from-z-score-calculator"
import { weightedAverageOvertimeCalculator } from "./weighted-average-overtime-calculator"
import { vwapCalculator } from "./vwap-calculator"

export type StatisticsSlug =
  | "weighted-average-grade"
  | "geometric-mean"
  | "harmonic-mean"
  | "time-weighted-average"
  | "coefficient-of-variance"
  | "pooled-variance"
  | "one-way-analysis-of-variance"
  | "two-way-analysis-of-variance"
  | "z-score-to-percentile"
  | "critical-z-value"
  | "p-value-from-z-score"
  | "weighted-average-overtime"
  | "volume-weighted-average-price"

export const STATS_CANONICAL_SLUG_MAP: Record<string, StatisticsSlug> = {
  "weighted-average-grade": "weighted-average-grade",
  "weighted-average-grade-calculator": "weighted-average-grade",
  "geometric-mean": "geometric-mean",
  "geometric-mean-calculator": "geometric-mean",
  "harmonic-mean": "harmonic-mean",
  "harmonic-mean-calculator": "harmonic-mean",
  "time-weighted-average": "time-weighted-average",
  "time-weighted-average-calculator": "time-weighted-average",
  "coefficient-of-variance": "coefficient-of-variance",
  "coefficient-of-variance-calculator": "coefficient-of-variance",
  "pooled-variance": "pooled-variance",
  "pooled-variance-calculator": "pooled-variance",
  "one-way-analysis-of-variance": "one-way-analysis-of-variance",
  "one-way-anova-calculator": "one-way-analysis-of-variance",
  "two-way-analysis-of-variance": "two-way-analysis-of-variance",
  "two-way-anova-calculator": "two-way-analysis-of-variance",
  "z-score-to-percentile": "z-score-to-percentile",
  "z-score-to-percentile-calculator": "z-score-to-percentile",
  "critical-z-value": "critical-z-value",
  "critical-z-value-calculator": "critical-z-value",
  "p-value-from-z-score": "p-value-from-z-score",
  "p-value-from-z-score-calculator": "p-value-from-z-score",
  "weighted-average-overtime": "weighted-average-overtime",
  "weighted-average-overtime-calculator": "weighted-average-overtime",
  "volume-weighted-average-price": "volume-weighted-average-price",
  "vwap-calculator": "volume-weighted-average-price",
}

export const STATS_DETAILS: Record<StatisticsSlug, CalculatorDetail> = {
  "weighted-average-grade": weightedAverageGradeCalculator,
  "geometric-mean": geometricMeanCalculator,
  "harmonic-mean": harmonicMeanCalculator,
  "time-weighted-average": timeWeightedAverageCalculator,
  "coefficient-of-variance": coefficientOfVarianceCalculator,
  "pooled-variance": pooledVarianceCalculator,
  "one-way-analysis-of-variance": oneWayAnovaCalculator,
  "two-way-analysis-of-variance": twoWayAnovaCalculator,
  "z-score-to-percentile": zScoreToPercentileCalculator,
  "critical-z-value": criticalZValueCalculator,
  "p-value-from-z-score": pValueFromZScoreCalculator,
  "weighted-average-overtime": weightedAverageOvertimeCalculator,
  "volume-weighted-average-price": vwapCalculator,
}

export function getStatsDetail(slug: string): CalculatorDetail | undefined {
  const canonical = STATS_CANONICAL_SLUG_MAP[slug]
  return canonical ? STATS_DETAILS[canonical] : undefined
}
