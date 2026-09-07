"use client"

import { useState } from "react"
import { IconCircleCheck, IconRotate, IconX } from "@tabler/icons-react"

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
import { formatCurrency, formatDecimal, formatPercent } from "@/lib/format"

const DEFAULTS = { cost: "12000", hours: "500", rate: "50" }

export function B2bRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const cost = parseNumericInput(values.cost, { min: 0.000001 })
  const hours = parseNumericInput(values.hours, { min: 0 })
  const rate = parseNumericInput(values.rate, { min: 0 })

  const valid = cost.value !== null && hours.value !== null && rate.value !== null

  const value = valid ? hours.value! * rate.value! : 0
  const net = valid ? value - cost.value! : 0
  const roi = valid ? (net / cost.value!) * 100 : null
  const paybackMonths = valid && value > 0 ? (cost.value! / value) * 12 : null
  const smart = net > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>The purchase</CardTitle>
          <CardDescription>
            What the tool or service costs per year, and the team time it gives back.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Annual cost"
            value={values.cost}
            onChange={(v) => update("cost", v)}
            error={cost.error}
            suffix="$"
            placeholder="12000"
          />
          <NumberField
            label="Hours saved / year"
            value={values.hours}
            onChange={(v) => update("hours", v)}
            error={hours.error}
            hint="Team hours the tool eliminates"
            placeholder="500"
          />
          <NumberField
            label="Value per hour"
            value={values.rate}
            onChange={(v) => update("rate", v)}
            error={rate.error}
            hint="Loaded cost of the people whose time is freed"
            suffix="$"
            placeholder="50"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && roi !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Net annual value"
              value={formatCurrency(net)}
              sub={`${formatCurrency(value)} of value vs ${formatCurrency(cost.value!)} of cost`}
            />

            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                smart
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              }`}
            >
              {smart ? <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" /> : <IconX className="mt-0.5 h-4 w-4 shrink-0" />}
              <p>
                {smart
                  ? `Yes — a smart investment. It returns ${formatPercent(roi)} on its cost and pays for itself in ${paybackMonths !== null ? formatDecimal(paybackMonths, 1) : "—"} months.`
                  : `No — at ${formatCurrency(value)} of value against ${formatCurrency(cost.value!)} of cost, renegotiate the price or skip it.`}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="ROI" value={formatPercent(roi)} sub="(Value − cost) ÷ cost" />
              <MetricTile
                label="Payback"
                value={paybackMonths !== null ? `${formatDecimal(paybackMonths, 1)} mo` : "—"}
                sub="Months until value covers cost"
              />
              <MetricTile
                label="Value generated"
                value={formatCurrency(value)}
                sub={`${formatDecimal(hours.value!, 0)} h × ${formatCurrency(rate.value!, 0)}`}
              />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter cost, hours saved and hourly value"
            description="Net value, ROI and the yes-or-no verdict appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
