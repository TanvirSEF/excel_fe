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

const DEFAULTS = { start: "10000", end: "12500", income: "500", period: "3" }

type PeriodUnit = "days" | "months" | "years"

const UNITS: Record<PeriodUnit, { label: string; perYear: number }> = {
  days: { label: "Days", perYear: 365 },
  months: { label: "Months", perYear: 12 },
  years: { label: "Years", perYear: 1 },
}

export function HoldingPeriodReturnCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const [unit, setUnit] = useState<PeriodUnit>("years")
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const start = parseNumericInput(values.start, { min: 0.000001 })
  const end = parseNumericInput(values.end, { min: 0 })
  const income = parseNumericInput(values.income, { min: 0 })
  const period = parseNumericInput(values.period, { min: 0.000001 })

  const valid = [start, end, income, period].every((field) => field.value !== null)

  const capitalGain = valid ? end.value! - start.value! : 0
  const netProfit = valid ? capitalGain + income.value! : 0
  const hpr = valid ? (netProfit / start.value!) * 100 : null
  const yearsHeld = valid ? period.value! / UNITS[unit].perYear : 0
  const annualized =
    valid && yearsHeld > 0 && 1 + netProfit / start.value! > 0
      ? ((1 + netProfit / start.value!) ** (1 / yearsHeld) - 1) * 100
      : null
  const incomeYield = valid ? (income.value! / start.value!) * 100 : null
  const positive = netProfit >= 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter investment details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Asset values
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Initial investment ($)" value={values.start} onChange={(v) => update("start", v)} error={start.error} suffix="$" placeholder="10000" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Ending value ($)" value={values.end} onChange={(v) => update("end", v)} error={end.error} suffix="$" placeholder="12500" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Income &amp; duration
          </p>
          <NumberField label="Income received ($)" value={values.income} onChange={(v) => update("income", v)} error={income.error} hint="Dividends or Rent" suffix="$" placeholder="500" />
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Holding period" value={values.period} onChange={(v) => update("period", v)} error={period.error} placeholder="3" />
            </div>
            <div className="w-28 shrink-0 pb-0.5">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Unit</p>
              <Select value={unit} onValueChange={(value) => setUnit(value as PeriodUnit)}>
                <SelectTrigger className="w-full" aria-label="Period unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && hpr !== null && annualized !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Holding period return"
              value={formatPercent(hpr, 2)}
            />

            {positive ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Positive Return: Investment grew by {formatPercent(hpr, 1)}.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs leading-relaxed text-rose-700 dark:text-rose-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Negative Return: Investment lost {formatPercent(Math.abs(hpr), 1)}.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Total net profit" value={formatCurrency(netProfit)} sub="Capital gain + income" />
              <MetricTile label="Annualized return" value={formatPercent(annualized, 2)} sub={`CAGR over ${period.value} ${UNITS[unit].label.toLowerCase()}`} />
              <MetricTile label="Capital gain" value={formatCurrency(capitalGain)} sub="End value − initial" />
              <MetricTile label="Income yield" value={incomeYield !== null ? formatPercent(incomeYield, 2) : "—"} sub="Income ÷ initial value" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your investment details"
            description="Holding period return, annualized return and profit appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
