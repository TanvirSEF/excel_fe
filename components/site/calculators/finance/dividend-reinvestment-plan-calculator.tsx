"use client"

import { useState } from "react"
import { IconCircleCheck, IconRotate } from "@tabler/icons-react"

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
import { formatCurrency, formatPercent } from "@/lib/format"
import { simulateDrip } from "@/lib/finance"

const DEFAULTS = {
  investment: "10000",
  addition: "1200",
  yieldPct: "4",
  growthPct: "5",
  taxRate: "15",
  years: "20",
}

export function DividendReinvestmentPlanCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const investment = parseNumericInput(values.investment, { min: 1 })
  const addition = parseNumericInput(values.addition, { min: 0 })
  const yieldPct = parseNumericInput(values.yieldPct, { min: 0.01, max: 100 })
  const growthPct = parseNumericInput(values.growthPct, { min: 0 })
  const taxRate = parseNumericInput(values.taxRate, { min: 0, max: 100 })
  const years = parseNumericInput(values.years, { min: 1, max: 50, integer: true })

  const valid = [investment, addition, yieldPct, growthPct, taxRate, years].every(
    (f) => f.value !== null
  )

  const result = valid
    ? simulateDrip({
        investment: investment.value!,
        yieldPct: yieldPct.value!,
        contribution: addition.value!,
        priceGrowthPct: growthPct.value!,
        taxRatePct: taxRate.value!,
        years: years.value!,
      })
    : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enter portfolio details</CardTitle>
            <CardDescription>
              Your starting capital, yearly additions, dividend yield, price growth and
              tax rate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              1. Investment capital
            </p>
            <NumberField label="Current principal ($)" value={values.investment} onChange={(v) => update("investment", v)} error={investment.error} suffix="$" placeholder="10000" />
            <NumberField label="Annual addition ($)" value={values.addition} onChange={(v) => update("addition", v)} error={addition.error} hint="Extra money invested each year" suffix="$" placeholder="1200" />

            <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              2. Dividend &amp; growth specs
            </p>
            <NumberField label="Dividend yield (%)" value={values.yieldPct} onChange={(v) => update("yieldPct", v)} error={yieldPct.error} suffix="%" placeholder="4" />
            <NumberField label="Price growth (%)" value={values.growthPct} onChange={(v) => update("growthPct", v)} error={growthPct.error} hint="S&P 500 historically grows 7–8%/yr" suffix="%" placeholder="5" />
            <NumberField label="Tax rate (%)" value={values.taxRate} onChange={(v) => update("taxRate", v)} error={taxRate.error} hint="Dividend tax — 0% in an IRA/401(k)" suffix="%" placeholder="15" />
            <NumberField label="Years to invest" value={values.years} onChange={(v) => update("years", v)} error={years.error} suffix="yr" placeholder="20" />

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
                label={`Estimated portfolio value after ${years.value} years`}
                value={formatCurrency(result.finalValue, 0)}
                sub={`Final annual income: ${formatCurrency(result.finalIncome, 0)}/yr`}
              />

              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Solid Growth: Dividends are working effectively.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetricTile label="Total contributions" value={formatCurrency(result.totalContributions, 0)} sub="Principal + all yearly additions" />
                <MetricTile label="Total dividends (net)" value={formatCurrency(result.totalDividends, 0)} sub="After tax, all reinvested" />
                <MetricTile label="Price growth" value={formatCurrency(result.priceGrowthAmount, 0)} sub="Capital appreciation" />
                <MetricTile label="Yield on cost (YOC)" value={formatPercent(result.yieldOnCost)} sub="Final income ÷ your contributions" />
              </div>
            </ResultsRegion>
          ) : (
            <ResultsPlaceholder
              title="Enter your investment details"
              description="Portfolio value, income and yield on cost appear here instantly."
            />
          )}
        </div>
    </div>
  )
}
