"use client"

import { useState } from "react"
import { IconCircleCheck, IconInfoCircle, IconRotate } from "@tabler/icons-react"

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency } from "@/lib/format"

const DEFAULTS = { rate: "25.00", regular: "40", overtime: "5", doubleTime: "0" }

type PeriodView = "period" | "weekly" | "biweekly"

const PERIOD_LABELS: Record<PeriodView, string> = {
  period: "This Period",
  weekly: "This Week",
  biweekly: "Bi-Weekly Total",
}

export function PayrollOvertimeCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const [view, setView] = useState<PeriodView>("period")
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const rate = parseNumericInput(values.rate, { min: 0.01 })
  const regular = parseNumericInput(values.regular, { min: 0 })
  const overtime = parseNumericInput(values.overtime, { min: 0 })
  const doubleTime = parseNumericInput(values.doubleTime, { min: 0 })

  const valid = [rate, regular, overtime, doubleTime].every(
    (field) => field.value !== null
  )

  const regularPay = valid ? regular.value! * rate.value! : 0
  const overtimePay = valid ? overtime.value! * rate.value! * 1.5 : 0
  const doubleTimePay = valid ? doubleTime.value! * rate.value! * 2 : 0
  const totalPay = valid ? regularPay + overtimePay + doubleTimePay : 0
  const totalHours = valid ? regular.value! + overtime.value! + doubleTime.value! : 0
  const effectiveRate = valid && totalHours > 0 ? totalPay / totalHours : null
  const boosted = overtimePay + doubleTimePay > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Calculate gross pay &amp; overtime</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Hourly rate ($)" value={values.rate} onChange={(v) => update("rate", v)} error={rate.error} suffix="$" placeholder="25.00" />

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Pay period view</p>
            <Tabs value={view} onValueChange={(value) => setView(value as PeriodView)}>
              <TabsList className="w-full">
                <TabsTrigger value="period" className="flex-1">This Period Only</TabsTrigger>
                <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
                <TabsTrigger value="biweekly" className="flex-1">Bi-Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Hours worked ({PERIOD_LABELS[view].toLowerCase()})
          </p>
          <NumberField label="Regular (1.0x)" value={values.regular} onChange={(v) => update("regular", v)} error={regular.error} placeholder="40" />
          <NumberField label="Overtime (1.5x)" value={values.overtime} onChange={(v) => update("overtime", v)} error={overtime.error} placeholder="5" />
          <NumberField label="Double time (2.0x)" value={values.doubleTime} onChange={(v) => update("doubleTime", v)} error={doubleTime.error} hint="Holiday / 7th Day" placeholder="0" />

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
              label="Total gross pay"
              value={formatCurrency(totalPay)}
              sub={
                effectiveRate !== null
                  ? `Effective rate: ${formatCurrency(effectiveRate)}/hr`
                  : undefined
              }
            />

            {boosted ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Boosted Pay: Includes {formatCurrency(overtimePay + doubleTimePay)} in
                  overtime premiums.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Standard Pay: Regular hours only.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Regular pay" value={formatCurrency(regularPay)} sub="Hours × rate" />
              <MetricTile label="Overtime (1.5x)" value={formatCurrency(overtimePay)} sub="Hours × rate × 1.5" />
              <MetricTile label="Double time" value={formatCurrency(doubleTimePay)} sub="Hours × rate × 2.0" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your hours and rate"
            description="Gross pay, effective rate and the overtime breakdown appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
