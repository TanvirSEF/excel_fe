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
import { formatCurrency, formatDecimal } from "@/lib/format"
import { simulateSnowball } from "@/lib/finance"

const DEFAULTS = {
  investment: "10000",
  initYield: "3.5",
  taxRate: "15",
  monthlyContribution: "500",
  years: "20",
  divGrowth: "8",
  priceGrowth: "7",
}

export function DividendSnowballCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const investment = parseNumericInput(values.investment, { min: 1 })
  const initYield = parseNumericInput(values.initYield, { min: 0.01, max: 100 })
  const taxRate = parseNumericInput(values.taxRate, { min: 0, max: 100 })
  const monthlyContribution = parseNumericInput(values.monthlyContribution, { min: 0 })
  const years = parseNumericInput(values.years, { min: 1, max: 50, integer: true })
  const divGrowth = parseNumericInput(values.divGrowth, { min: 0 })
  const priceGrowth = parseNumericInput(values.priceGrowth, { min: 0 })

  const valid = [investment, initYield, taxRate, monthlyContribution, years, divGrowth, priceGrowth].every(
    (f) => f.value !== null
  )

  const result = valid
    ? simulateSnowball({
        investment: investment.value!,
        initialYieldPct: initYield.value!,
        taxRatePct: taxRate.value!,
        monthlyContribution: monthlyContribution.value!,
        years: years.value!,
        dividendGrowthPct: divGrowth.value!,
        priceGrowthPct: priceGrowth.value!,
      })
    : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dividend reinvestment plan</CardTitle>
            <CardDescription>
              See how reinvested dividends and monthly contributions turn into passive
              income over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              1. Starting portfolio
            </p>
            <NumberField label="Portfolio value ($)" value={values.investment} onChange={(v) => update("investment", v)} error={investment.error} suffix="$" placeholder="10000" />
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <NumberField label="Initial yield (%)" value={values.initYield} onChange={(v) => update("initYield", v)} error={initYield.error} hint="SCHD ≈ 3.5%" suffix="%" placeholder="3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <NumberField label="Tax rate (%)" value={values.taxRate} onChange={(v) => update("taxRate", v)} error={taxRate.error} hint="0% in IRA/TFSA" suffix="%" placeholder="15" />
              </div>
            </div>

            <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              2. Fueling growth
            </p>
            <NumberField label="Monthly contribution" value={values.monthlyContribution} onChange={(v) => update("monthlyContribution", v)} error={monthlyContribution.error} suffix="$" placeholder="500" />
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <NumberField label="Years to grow" value={values.years} onChange={(v) => update("years", v)} error={years.error} placeholder="20" />
              </div>
              <div className="min-w-0 flex-1">
                <NumberField label="Dividend growth rate (%)" value={values.divGrowth} onChange={(v) => update("divGrowth", v)} error={divGrowth.error} hint="Aristocrats: 5-10%" suffix="%" placeholder="8" />
              </div>
            </div>
            <NumberField label="Price appreciation (%)" value={values.priceGrowth} onChange={(v) => update("priceGrowth", v)} error={priceGrowth.error} hint="S&P 500: 7-8%" suffix="%" placeholder="7" />

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
                label="Future annual income"
                value={formatCurrency(result.finalAnnualIncome, 0)}
                sub={`Equivalent wage: $${formatDecimal(result.hourlyWage, 2)}/hr`}
              />

              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Solid Income: Portfolio is working well.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetricTile label="Total portfolio" value={formatCurrency(result.finalValue, 0)} sub="Shares × final price" />
                <MetricTile label="Total reinvested" value={formatCurrency(result.totalReinvested, 0)} sub="After-tax dividends rolled in" />
                <MetricTile label="Your contributions" value={formatCurrency(result.totalContributions, 0)} sub="Principal + monthly additions" />
                <MetricTile label="Yield on cost (YOC)" value={`${formatDecimal(result.yieldOnCost, 2)}%`} sub="Final income ÷ your money in" />
              </div>
            </ResultsRegion>
          ) : (
            <ResultsPlaceholder
              title="Enter your snowball plan"
              description="Future income, portfolio value and yield on cost appear here."
            />
          )}
        </div>
    </div>
  )
}
