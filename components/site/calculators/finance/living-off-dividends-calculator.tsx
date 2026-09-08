"use client"

import { useState } from "react"
import { IconAlertTriangle, IconCircleCheck, IconRotate } from "@tabler/icons-react"

import { NumberField } from "@/components/site/calculators/field"
import {
  GradientHeroMetric,
  MetricTile,
  ResultsPlaceholder,
  ResultsRegion,
} from "@/components/site/calculators/result-metrics"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatDecimal } from "@/lib/format"
import { LIVING_OFF_MAX_YEARS, simulateLivingOffDividends } from "@/lib/finance"

const DEFAULTS = {
  targetIncome: "4000",
  taxRate: "15",
  inflation: "3",
  currentValue: "50000",
  monthlyContribution: "1000",
  yieldPct: "4",
  divGrowth: "6",
  priceGrowth: "7",
}

export function LivingOffDividendsCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const targetIncome = parseNumericInput(values.targetIncome, { min: 1 })
  const taxRate = parseNumericInput(values.taxRate, { min: 0, max: 100 })
  const inflation = parseNumericInput(values.inflation, { min: 0, max: 30 })
  const currentValue = parseNumericInput(values.currentValue, { min: 1 })
  const monthlyContribution = parseNumericInput(values.monthlyContribution, { min: 0 })
  const yieldPct = parseNumericInput(values.yieldPct, { min: 0.01, max: 100 })
  const divGrowth = parseNumericInput(values.divGrowth, { min: 0 })
  const priceGrowth = parseNumericInput(values.priceGrowth, { min: 0 })

  const valid = [
    targetIncome,
    taxRate,
    inflation,
    currentValue,
    monthlyContribution,
    yieldPct,
    divGrowth,
    priceGrowth,
  ].every((f) => f.value !== null)

  const result = valid
    ? simulateLivingOffDividends({
        currentPortfolio: currentValue.value!,
        targetMonthlyIncome: targetIncome.value!,
        dividendYieldPct: yieldPct.value!,
        dividendGrowthPct: divGrowth.value!,
        priceGrowthPct: priceGrowth.value!,
        taxRatePct: taxRate.value!,
        inflationPct: inflation.value!,
        monthlyContribution: monthlyContribution.value!,
      })
    : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter financial freedom goals</CardTitle>
          <CardDescription>
            Your income target, current portfolio and market assumptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Income targets
          </p>
          <NumberField label="Target monthly income ($)" value={values.targetIncome} onChange={(v) => update("targetIncome", v)} error={targetIncome.error} suffix="$" placeholder="4000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Dividend tax rate (%)" value={values.taxRate} onChange={(v) => update("taxRate", v)} error={taxRate.error} suffix="%" placeholder="15" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Inflation rate (%)" value={values.inflation} onChange={(v) => update("inflation", v)} error={inflation.error} suffix="%" placeholder="3" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Current portfolio
          </p>
          <NumberField label="Current value ($)" value={values.currentValue} onChange={(v) => update("currentValue", v)} error={currentValue.error} suffix="$" placeholder="50000" />
          <NumberField label="Monthly contribution ($)" value={values.monthlyContribution} onChange={(v) => update("monthlyContribution", v)} error={monthlyContribution.error} suffix="$" placeholder="1000" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            3. Market assumptions
          </p>
          <NumberField label="Dividend yield (%)" value={values.yieldPct} onChange={(v) => update("yieldPct", v)} error={yieldPct.error} suffix="%" placeholder="4" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Div. growth rate (%)" value={values.divGrowth} onChange={(v) => update("divGrowth", v)} error={divGrowth.error} suffix="%" placeholder="6" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Price appreciation (%)" value={values.priceGrowth} onChange={(v) => update("priceGrowth", v)} error={priceGrowth.error} suffix="%" placeholder="7" />
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {result ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Time to financial freedom"
              value={
                result.yearsToFreedom === null
                  ? `${LIVING_OFF_MAX_YEARS}+ Years`
                  : result.yearsToFreedom === 0
                    ? "Already free"
                    : `${result.yearsToFreedom} Years`
              }
            />

            {result.covered ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>On Track: Keep investing consistently.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Not reached within {LIVING_OFF_MAX_YEARS} years — increase your
                  contributions or lower your target income.
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Required portfolio value" value={formatCurrency(result.portfolioValue, 0)} sub="At your freedom year" />
              <MetricTile label="Current income" value={`${formatCurrency(result.netMonthlyIncome, 0)}/mo`} sub="Net dividend income then" />
              <MetricTile label="Inflation-adj goal" value={`${formatCurrency(result.inflatedMonthlyGoal, 0)}/mo`} sub="Target inflated to that year" />
              <MetricTile label="Income gap" value={result.covered ? "Covered" : "Not covered"} sub="Income vs inflated goal" />
              <MetricTile label="Yield on cost" value={`${formatDecimal(result.yieldOnCost, 1)}%`} sub="Final income ÷ contributions" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your freedom goals"
            description="Time to financial freedom and your freedom number appear here."
          />
        )}
      </div>
    </div>
  )
}
