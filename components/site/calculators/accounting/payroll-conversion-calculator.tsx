"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

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

const DEFAULTS = { salary: "60000", hoursPerWeek: "40", weeksPerYear: "52" }

export function PayrollConversionCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const salary = parseNumericInput(values.salary, { min: 0.01 })
  const hoursPerWeek = parseNumericInput(values.hoursPerWeek, { min: 0.01 })
  const weeksPerYear = parseNumericInput(values.weeksPerYear, { min: 1 })

  const valid = salary.value !== null && hoursPerWeek.value !== null && weeksPerYear.value !== null

  const annualHours = valid ? hoursPerWeek.value! * weeksPerYear.value! : 0
  const hourly = valid && annualHours > 0 ? salary.value! / annualHours : null
  const weekly = valid ? salary.value! / weeksPerYear.value! : null
  const biweekly = weekly !== null ? weekly * 2 : null
  const semimonthly = valid ? salary.value! / 24 : null
  const monthly = valid ? salary.value! / 12 : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Annual salary</CardTitle>
          <CardDescription>
            Converted into every pay timeline, adjusted for your real working schedule.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Annual salary" value={values.salary} onChange={(v) => update("salary", v)} error={salary.error} suffix="$" placeholder="60000" />
          <NumberField label="Hours per week" value={values.hoursPerWeek} onChange={(v) => update("hoursPerWeek", v)} error={hoursPerWeek.error} placeholder="40" />
          <NumberField label="Working weeks / yr" value={values.weeksPerYear} onChange={(v) => update("weeksPerYear", v)} error={weeksPerYear.error} hint="52 = no unpaid leave · 48 accounts for 4 weeks off" placeholder="52" />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && hourly !== null && weekly !== null && biweekly !== null && semimonthly !== null && monthly !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Effective hourly rate"
              value={formatCurrency(hourly)}
              sub={`${formatDecimal(annualHours, 0)} working hours per year`}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Weekly" value={formatCurrency(weekly)} sub="Every week" />
              <MetricTile label="Biweekly" value={formatCurrency(biweekly)} sub="Every 2 weeks — 26 paychecks" />
              <MetricTile label="Semimonthly" value={formatCurrency(semimonthly)} sub="1st & 15th — 24 paychecks" />
              <MetricTile label="Monthly" value={formatCurrency(monthly)} sub="12 paychecks" />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Biweekly paychecks (26×) land slightly larger than semimonthly (24×) — two
              &quot;extra&quot; paycheck months a year make budgeting easier if you plan
              around them.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter salary and schedule"
            description="Hourly, weekly, biweekly, semimonthly and monthly rates appear here."
          />
        )}
      </div>
    </div>
  )
}
