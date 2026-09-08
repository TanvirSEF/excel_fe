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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = {
  savings: "500000",
  withdrawal: "2500",
  returnPct: "6",
  inflationPct: "2.5",
}

type Frequency = "monthly" | "quarterly" | "annually"

const FREQUENCIES: Record<Frequency, { label: string; periodsPerYear: number }> = {
  monthly: { label: "Monthly", periodsPerYear: 12 },
  quarterly: { label: "Quarterly", periodsPerYear: 4 },
  annually: { label: "Annually", periodsPerYear: 1 },
}

const MAX_YEARS = 100

function durationLabel(periods: number, perYear: number): string {
  const totalMonths = Math.round((periods / perYear) * 12)
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const parts: string[] = []
  if (years > 0) parts.push(`${years} Year${years === 1 ? "" : "s"}`)
  if (months > 0) parts.push(`${months} Month${months === 1 ? "" : "s"}`)
  return parts.length > 0 ? parts.join(" ") : "0 Months"
}

export function SavingsWithdrawalCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const [frequency, setFrequency] = useState<Frequency>("monthly")
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const savings = parseNumericInput(values.savings, { min: 0.000001 })
  const withdrawal = parseNumericInput(values.withdrawal, { min: 0.000001 })
  const returnPct = parseNumericInput(values.returnPct, { min: 0, max: 50 })
  const inflationPct = parseNumericInput(values.inflationPct, { min: 0, max: 30 })

  const valid = [savings, withdrawal, returnPct, inflationPct].every(
    (field) => field.value !== null
  )

  let lastingPeriods: number | null = null
  let totalWithdrawn = 0
  let sustainable = false

  if (valid) {
    const perYear = FREQUENCIES[frequency].periodsPerYear
    const periodRate = returnPct.value! / 100 / perYear
    const periodInflation = (1 + inflationPct.value! / 100) ** (1 / perYear)
    let balance = savings.value!
    let currentWithdrawal = withdrawal.value!
    let lastSolvent = 0

    for (let period = 1; period <= MAX_YEARS * perYear; period++) {
      balance = balance * (1 + periodRate) - currentWithdrawal
      totalWithdrawn += currentWithdrawal
      currentWithdrawal *= periodInflation
      if (balance >= 0) lastSolvent = period
      else break
      if (period === MAX_YEARS * perYear) sustainable = true
    }

    lastingPeriods = sustainable ? null : lastSolvent
  }

  const durationYears =
    valid && lastingPeriods !== null
      ? lastingPeriods / FREQUENCIES[frequency].periodsPerYear
      : null
  const annualWithdrawalRate =
    valid && savings.value! > 0
      ? (withdrawal.value! * FREQUENCIES[frequency].periodsPerYear * 100) / savings.value!
      : null

  const solid = sustainable || (durationYears !== null && durationYears >= 20)
  const moderate = durationYears !== null && durationYears >= 10

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter withdrawal plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Portfolio &amp; withdrawal
          </p>
          <NumberField label="Total savings ($)" value={values.savings} onChange={(v) => update("savings", v)} error={savings.error} suffix="$" placeholder="500000" />
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Withdrawal amount ($)" value={values.withdrawal} onChange={(v) => update("withdrawal", v)} error={withdrawal.error} suffix="$" placeholder="2500" />
            </div>
            <div className="w-32 shrink-0 pb-0.5">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Frequency</p>
              <Select value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}>
                <SelectTrigger className="w-full" aria-label="Withdrawal frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Economic factors
          </p>
          <NumberField label="Annual return (%)" value={values.returnPct} onChange={(v) => update("returnPct", v)} error={returnPct.error} hint="Expected Profit Rate" suffix="%" placeholder="6" />
          <NumberField label="Inflation rate (%)" value={values.inflationPct} onChange={(v) => update("inflationPct", v)} error={inflationPct.error} hint="Inflation Adjustment" suffix="%" placeholder="2.5" />

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
              label="Estimated duration"
              value={
                sustainable
                  ? `${MAX_YEARS}+ Years`
                  : durationLabel(lastingPeriods!, FREQUENCIES[frequency].periodsPerYear)
              }
            />

            {solid ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {sustainable
                    ? "Sustainable: Savings outlast withdrawals."
                    : "Solid Plan: Lasts a long time."}
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {moderate
                    ? "Moderate Plan: Watch your withdrawal rate."
                    : "Short Runway: Savings deplete quickly."}
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Total withdrawn" value={formatCurrency(totalWithdrawn, 0)} sub="Across the full duration" />
              <MetricTile label="Annual withdrawal rate" value={annualWithdrawalRate !== null ? formatPercent(annualWithdrawalRate, 1) : "—"} sub="First-year withdrawals ÷ savings" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your withdrawal plan"
            description="How long your savings last appears here instantly."
          />
        )}
      </div>
    </div>
  )
}
