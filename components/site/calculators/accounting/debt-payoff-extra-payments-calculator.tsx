"use client"

import { useState } from "react"
import { addMonths, format } from "date-fns"
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
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency } from "@/lib/format"

function durationLabel(totalMonths: number): string {
  if (totalMonths < 12) return `${totalMonths}m`
  return `${Math.floor(totalMonths / 12)}y ${totalMonths % 12}m`
}

const DEFAULTS = {
  balance: "10000",
  rate: "5",
  minPayment: "250",
  extra: "50",
  lumpSum: "0",
  lumpMonth: "6",
}

interface PayoffResult {
  months: number | null
  interest: number
}

function simulate(
  balance: number,
  monthlyRate: number,
  basePayment: number,
  extra: number,
  lumpSum: number,
  lumpMonth: number
): PayoffResult {
  let remaining = balance
  let months = 0
  let interest = 0

  while (remaining > 0 && months < 600) {
    months++
    const monthInterest = remaining * monthlyRate
    interest += monthInterest
    const firstMonth = months === 1
    if (firstMonth && basePayment + extra <= monthInterest) return { months: null, interest }
    let payment = basePayment + extra
    if (months === lumpMonth) payment += lumpSum
    remaining = remaining + monthInterest - Math.min(payment, remaining + monthInterest)
  }

  return { months: remaining > 0 ? null : months, interest }
}

export function DebtPayoffExtraPaymentsCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const balance = parseNumericInput(values.balance, { min: 0.000001 })
  const rate = parseNumericInput(values.rate, { min: 0, max: 100 })
  const minPayment = parseNumericInput(values.minPayment, { min: 0.000001 })
  const extra = parseNumericInput(values.extra, { min: 0 })
  const lumpSum = parseNumericInput(values.lumpSum, { min: 0 })
  const lumpMonth = parseNumericInput(values.lumpMonth, { min: 1, integer: true })

  const valid = [balance, rate, minPayment, extra, lumpSum, lumpMonth].every(
    (field) => field.value !== null
  )

  const monthlyRate = valid ? rate.value! / 100 / 12 : 0
  const accelerated = valid
    ? simulate(balance.value!, monthlyRate, minPayment.value!, extra.value!, lumpSum.value!, lumpMonth.value!)
    : null
  const baseline = valid
    ? simulate(balance.value!, monthlyRate, minPayment.value!, 0, 0, 0)
    : null

  const never = accelerated?.months === null
  const interestSaved =
    accelerated !== null && baseline !== null && !never
      ? Math.max(0, Math.round(baseline.interest - accelerated.interest))
      : 0
  const timeSaved =
    accelerated !== null && baseline !== null && !never
      ? Math.max(0, baseline.months! - accelerated.months!)
      : 0
  const completionDate =
    accelerated !== null && !never
      ? format(addMonths(new Date(), accelerated.months!), "MMMM yyyy")
      : null
  const accelerating = extra.value! > 0 || lumpSum.value! > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Financing payoff strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Balance snapshot
          </p>
          <NumberField label="Current balance ($)" value={values.balance} onChange={(v) => update("balance", v)} error={balance.error} suffix="$" placeholder="10000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Profit rate (%)" value={values.rate} onChange={(v) => update("rate", v)} error={rate.error} hint="Annual Markup" suffix="%" placeholder="5" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Minimum payment ($)" value={values.minPayment} onChange={(v) => update("minPayment", v)} error={minPayment.error} suffix="$" placeholder="250" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Acceleration strategy
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Extra monthly ($)" value={values.extra} onChange={(v) => update("extra", v)} error={extra.error} suffix="$" placeholder="50" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="One-time lump sum ($)" value={values.lumpSum} onChange={(v) => update("lumpSum", v)} error={lumpSum.error} suffix="$" placeholder="0" />
            </div>
          </div>
          <NumberField label="Apply in month #" value={values.lumpMonth} onChange={(v) => update("lumpMonth", v)} error={lumpMonth.error} placeholder="6" />

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && accelerated ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Estimated completion date"
              value={never ? "Never" : completionDate!}
            />

            {never ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Never: Your payment falls below the monthly finance fees — increase your
                  minimum payment right away.
                </p>
              </div>
            ) : accelerating ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Strategy Active: Clearing balance faster.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Standard Payoff: No acceleration applied.</p>
              </div>
            )}

            {!never ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile label="Markup saved" value={formatCurrency(interestSaved, 0)} sub="vs minimum payments only" />
                <MetricTile label="Time saved" value={durationLabel(timeSaved)} sub="vs minimum payments only" />
                <MetricTile label="Total duration" value={durationLabel(accelerated.months!)} sub="From today" />
              </div>
            ) : null}
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your balance and payment plan"
            description="Your payoff date, savings and duration appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
