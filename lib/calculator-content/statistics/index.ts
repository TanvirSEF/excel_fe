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
  | "weighted-average-grade-calculator"
  | "geometric-mean-calculator"
  | "harmonic-mean-calculator"
  | "time-weighted-average-calculator"
  | "coefficient-of-variance-calculator"
  | "pooled-variance-calculator"
  | "one-way-anova-calculator"
  | "two-way-anova-calculator"
  | "z-score-to-percentile-calculator"
  | "critical-z-value-calculator"
  | "p-value-from-z-score-calculator"
  | "weighted-average-overtime-calculator"
  | "vwap-calculator"

export const STATS_DETAILS: Record<StatisticsSlug, CalculatorDetail> = {
  "weighted-average-grade-calculator": weightedAverageGradeCalculator,
  "geometric-mean-calculator": geometricMeanCalculator,
  "harmonic-mean-calculator": harmonicMeanCalculator,
  "time-weighted-average-calculator": timeWeightedAverageCalculator,
  "coefficient-of-variance-calculator": coefficientOfVarianceCalculator,
  "pooled-variance-calculator": pooledVarianceCalculator,
  "one-way-anova-calculator": oneWayAnovaCalculator,
  "two-way-anova-calculator": twoWayAnovaCalculator,
  "z-score-to-percentile-calculator": zScoreToPercentileCalculator,
  "critical-z-value-calculator": criticalZValueCalculator,
  "p-value-from-z-score-calculator": pValueFromZScoreCalculator,
  "weighted-average-overtime-calculator": weightedAverageOvertimeCalculator,
  "vwap-calculator": vwapCalculator,
}
