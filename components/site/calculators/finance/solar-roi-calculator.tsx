"use client"

import { useState } from "react"
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconRotate,
} from "@tabler/icons-react"

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = {
  cost: "25000",
  credits: "7500",
  monthlyBill: "200",
  offset: "90",
  utilityInflation: "4",
  incentivesYr: "0",
}

const SYSTEM_LIFETIME_YEARS = 25
const MAX_PAYBACK_YEARS = 50

function paybackVerdict(years: number): {
  kind: "excellent" | "moderate" | "slow"
  text: string
} {
  if (years <= 10)
    return { kind: "excellent", text: "Excellent Performance: Fast cost recovery." }
  if (years <= 15)
    return { kind: "moderate", text: "Reasonable Performance: A typical payback timeline." }
  return { kind: "slow", text: "Slow Performance: A long payback period." }
}

export function SolarRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const cost = parseNumericInput(values.cost, { min: 1 })
  const credits = parseNumericInput(values.credits, { min: 0 })
  const monthlyBill = parseNumericInput(values.monthlyBill, { min: 0 })
  const offset = parseNumericInput(values.offset, { min: 0, max: 100 })
  const utilityInflation = parseNumericInput(values.utilityInflation, { min: 0, max: 30 })
  const incentivesYr = parseNumericInput(values.incentivesYr, { min: 0 })

  const valid = [cost, credits, monthlyBill, offset, utilityInflation, incentivesYr].every(
    (field) => field.value !== null
  )

  const netCost = valid ? cost.value! - credits.value! : 0
  const baseSavings = valid
    ? monthlyBill.value! * 12 * (offset.value! / 100)
    : 0
  const inflationRate = valid ? utilityInflation.value! / 100 : 0

  const yearlySavings = (year: number) =>
    baseSavings * (1 + inflationRate) ** (year - 1) + (valid ? incentivesYr.value! : 0)

  let paybackYears: number | null = null
  let cumulative = 0
  for (let year = 1; year <= MAX_PAYBACK_YEARS; year++) {
    const yearSaving = yearlySavings(year)
    cumulative += yearSaving
    if (cumulative >= netCost && netCost > 0 && yearSaving > 0) {
      paybackYears = year - 1 + (netCost - (cumulative - yearSaving)) / yearSaving
      break
    }
  }

  let lifetimeSavings = 0
  for (let year = 1; year <= SYSTEM_LIFETIME_YEARS; year++) {
    lifetimeSavings += yearlySavings(year)
  }
  const netSavings = lifetimeSavings - netCost
  const totalRoi = netCost > 0 ? (netSavings / netCost) * 100 : null
  const averageMonthly = lifetimeSavings / (SYSTEM_LIFETIME_YEARS * 12)
  const year1Savings = yearlySavings(1)
  const verdict = paybackYears !== null ? paybackVerdict(paybackYears) : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter solar system details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. System costs &amp; incentives
          </p>
          <NumberField label="Total system cost ($)" value={values.cost} onChange={(v) => update("cost", v)} error={cost.error} suffix="$" placeholder="25000" />
          <NumberField label="Tax credits and rebates ($)" value={values.credits} onChange={(v) => update("credits", v)} error={credits.error} suffix="$" placeholder="7500" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Energy savings &amp; projections
          </p>
          <NumberField label="Monthly energy cost ($)" value={values.monthlyBill} onChange={(v) => update("monthlyBill", v)} error={monthlyBill.error} suffix="$" placeholder="200" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Bill offset (%)" value={values.offset} onChange={(v) => update("offset", v)} error={offset.error} suffix="%" placeholder="90" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Utility inflation (%)" value={values.utilityInflation} onChange={(v) => update("utilityInflation", v)} error={utilityInflation.error} suffix="%" placeholder="4" />
            </div>
          </div>
          <NumberField label="Solar incentives/yr ($)" value={values.incentivesYr} onChange={(v) => update("incentivesYr", v)} error={incentivesYr.error} suffix="$" placeholder="0" />

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Cost recovery period"
              value={
                paybackYears !== null
                  ? `${paybackYears.toFixed(1)} Years`
                  : `${MAX_PAYBACK_YEARS}+ Years`
              }
            />

            {verdict ? (
              <div
                className={
                  verdict.kind === "slow"
                    ? "flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400"
                    : "flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400"
                }
              >
                {verdict.kind === "moderate" ? (
                  <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : verdict.kind === "slow" ? (
                  <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <p>{verdict.text}</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Savings never cover the net cost within {MAX_PAYBACK_YEARS} years —
                  check your inputs or incentives.
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Net system cost" value={formatCurrency(netCost, 0)} sub="Cost − credits & rebates" />
              <MetricTile label={`${SYSTEM_LIFETIME_YEARS}-Year net savings`} value={formatCurrency(netSavings, 0)} sub="Compounded savings − net cost" />
              <MetricTile label="Year 1 savings" value={formatCurrency(year1Savings, 0)} sub="Bills offset + incentives" />
              <MetricTile label="Total ROI" value={totalRoi !== null ? formatPercent(totalRoi, 1) : "—"} sub="Net savings ÷ net cost" />
              <MetricTile label="Average monthly savings" value={formatCurrency(averageMonthly, 0)} sub={`Across ${SYSTEM_LIFETIME_YEARS} years`} />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your solar system details"
            description="Payback period, savings and ROI appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
