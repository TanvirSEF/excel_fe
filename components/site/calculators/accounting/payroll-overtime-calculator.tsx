"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { NumberField } from "@/components/site/calculators/field"
import { StepList } from "@/components/site/calculators/statistics/step-list"
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

const DEFAULTS = {
  rate: "20",
  regularHours: "40",
  otHours: "10",
  multiplier: "1.5",
}

export function PayrollOvertimeCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const rate = parseNumericInput(values.rate, { min: 0.01 })
  const regularHours = parseNumericInput(values.regularHours, { min: 0 })
  const otHours = parseNumericInput(values.otHours, { min: 0 })
  const multiplier = parseNumericInput(values.multiplier, { min: 1 })

  const valid = [rate, regularHours, otHours, multiplier].every((f) => f.value !== null)

  const regularPay = valid ? rate.value! * regularHours.value! : 0
  const otRate = valid ? rate.value! * multiplier.value! : 0
  const otPay = valid ? otRate * otHours.value! : 0
  const gross = regularPay + otPay
  const totalHours = valid ? regularHours.value! + otHours.value! : 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Timesheet</CardTitle>
          <CardDescription>
            Regular hours at base rate, overtime at the multiplier — standard FLSA payroll math.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Hourly rate" value={values.rate} onChange={(v) => update("rate", v)} error={rate.error} suffix="$" placeholder="20" />
          <NumberField label="Regular hours" value={values.regularHours} onChange={(v) => update("regularHours", v)} error={regularHours.error} placeholder="40" />
          <NumberField label="Overtime hours" value={values.otHours} onChange={(v) => update("otHours", v)} error={otHours.error} placeholder="10" />
          <NumberField label="OT multiplier" value={values.multiplier} onChange={(v) => update("multiplier", v)} error={multiplier.error} hint="1.5 = time-and-a-half (the FLSA standard)" placeholder="1.5" />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Gross pay"
              value={formatCurrency(gross)}
              sub={`${formatDecimal(totalHours, 1)} total hours · OT paid at ${formatCurrency(otRate)}/h`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Regular pay" value={formatCurrency(regularPay)} sub={`${formatDecimal(regularHours.value!, 1)} h × ${formatCurrency(rate.value!)}`} />
              <MetricTile label="Overtime pay" value={formatCurrency(otPay)} sub={`${formatDecimal(otHours.value!, 1)} h × ${formatCurrency(otRate)}`} />
              <MetricTile label="Effective hourly" value={formatCurrency(totalHours > 0 ? gross / totalHours : 0)} sub="Across all hours" />
            </div>

            <StepList
              steps={[
                { title: "Regular pay", body: `${formatDecimal(regularHours.value!, 0)} h × ${formatCurrency(rate.value!)} = ${formatCurrency(regularPay)}` },
                { title: "Overtime rate", body: `${formatCurrency(rate.value!)} × ${formatDecimal(multiplier.value!, 2)} = ${formatCurrency(otRate)}` },
                { title: "Gross pay", body: `${formatCurrency(regularPay)} + ${formatCurrency(otPay)} = ${formatCurrency(gross)}` },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              This is gross pay before taxes — the FAQ explains why we let you apply your
              own tax rate instead of guessing one.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter hours and rate"
            description="Gross pay with the overtime breakdown appears here instantly."
          />
        )}
      </div>
    </div>
  )
}
