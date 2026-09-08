"use client"

import { useState } from "react"
import { IconCircleCheck, IconRotate } from "@tabler/icons-react"

import { NumberField } from "@/components/site/calculators/field"
import {
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
import { formatCurrency } from "@/lib/format"

const DEFAULTS = {
  amount: "25.00",
  hoursPerWeek: "40",
  daysPerWeek: "5",
  weeksPerYear: "52",
}

type Frequency =
  | "hourly"
  | "daily"
  | "weekly"
  | "biweekly"
  | "semimonthly"
  | "monthly"
  | "annual"

const FREQUENCY_LABELS: Record<Frequency, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Bi-Weekly",
  semimonthly: "Semi-Monthly",
  monthly: "Monthly",
  annual: "Annual",
}

export function PayrollConversionCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const [frequency, setFrequency] = useState<Frequency>("hourly")
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const amount = parseNumericInput(values.amount, { min: 0.000001 })
  const hoursPerWeek = parseNumericInput(values.hoursPerWeek, { min: 0.01 })
  const daysPerWeek = parseNumericInput(values.daysPerWeek, { min: 0.01 })
  const weeksPerYear = parseNumericInput(values.weeksPerYear, { min: 1 })

  const valid = [amount, hoursPerWeek, daysPerWeek, weeksPerYear].every(
    (field) => field.value !== null
  )

  const annual = valid ? (() => {
    switch (frequency) {
      case "hourly":
        return amount.value! * hoursPerWeek.value! * weeksPerYear.value!
      case "daily":
        return amount.value! * daysPerWeek.value! * weeksPerYear.value!
      case "weekly":
        return amount.value! * weeksPerYear.value!
      case "biweekly":
        return amount.value! * (weeksPerYear.value! / 2)
      case "semimonthly":
        return amount.value! * 24
      case "monthly":
        return amount.value! * 12
      case "annual":
        return amount.value!
    }
  })() : 0

  const hourly = valid ? annual / (hoursPerWeek.value! * weeksPerYear.value!) : 0
  const daily = valid ? annual / (daysPerWeek.value! * weeksPerYear.value!) : 0
  const weekly = valid ? annual / weeksPerYear.value! : 0
  const biweekly = valid ? annual / (weeksPerYear.value! / 2) : 0
  const semimonthly = valid ? annual / 24 : 0
  const monthly = valid ? annual / 12 : 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Convert your wage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Current amount" value={values.amount} onChange={(v) => update("amount", v)} error={amount.error} suffix="$" placeholder="25.00" />
            </div>
            <div className="w-36 shrink-0 pb-0.5">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Pay frequency</p>
              <Select value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}>
                <SelectTrigger className="w-full" aria-label="Pay frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {FREQUENCY_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Work schedule assumptions
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Hours/week" value={values.hoursPerWeek} onChange={(v) => update("hoursPerWeek", v)} error={hoursPerWeek.error} placeholder="40" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Days/week" value={values.daysPerWeek} onChange={(v) => update("daysPerWeek", v)} error={daysPerWeek.error} placeholder="5" />
            </div>
          </div>
          <NumberField label="Weeks/year" value={values.weeksPerYear} onChange={(v) => update("weeksPerYear", v)} error={weeksPerYear.error} placeholder="52" />

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid ? (
          <ResultsRegion>
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
              <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Converted: Base Annual Salary is {formatCurrency(annual)}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Hourly rate" value={formatCurrency(hourly)} />
              <MetricTile label="Daily rate" value={formatCurrency(daily)} />
              <MetricTile label="Weekly pay" value={formatCurrency(weekly)} />
              <MetricTile label="Bi-weekly (26/yr)" value={formatCurrency(biweekly)} />
              <MetricTile label="Semi-monthly (24/yr)" value={formatCurrency(semimonthly)} />
              <MetricTile label="Monthly pay" value={formatCurrency(monthly)} />
              <MetricTile label="Annual salary" value={formatCurrency(annual)} />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your wage and schedule"
            description="Your pay across every common pay period appears here instantly."
          />
        )}
      </div>
    </div>
  )
}
