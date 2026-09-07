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
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = { revenue: "500000", margin: "40", salary: "80000", commission: "20000", benefits: "10000" }

export function SalespersonProfitabilityCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const revenue = parseNumericInput(values.revenue, { min: 0 })
  const margin = parseNumericInput(values.margin, { min: 0, max: 100 })
  const salary = parseNumericInput(values.salary, { min: 0 })
  const commission = parseNumericInput(values.commission, { min: 0 })
  const benefits = parseNumericInput(values.benefits, { min: 0 })

  const valid = [revenue, margin, salary, commission, benefits].every((f) => f.value !== null)

  const grossProfit = valid ? (revenue.value! * margin.value!) / 100 : 0
  const totalCost = valid ? salary.value! + commission.value! + benefits.value! : 0
  const net = grossProfit - totalCost
  const roi = valid && totalCost > 0 ? (net / totalCost) * 100 : null
  const asset = net > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>The salesperson</CardTitle>
          <CardDescription>
            What they bring in, and the full cost of having them on the team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Revenue generated / yr" value={values.revenue} onChange={(v) => update("revenue", v)} error={revenue.error} suffix="$" placeholder="500000" />
          <NumberField label="Gross margin on sales" value={values.margin} onChange={(v) => update("margin", v)} error={margin.error} hint="Their share of revenue that is actual profit" suffix="%" placeholder="40" />
          <NumberField label="Base salary / yr" value={values.salary} onChange={(v) => update("salary", v)} error={salary.error} suffix="$" placeholder="80000" />
          <NumberField label="Commissions paid / yr" value={values.commission} onChange={(v) => update("commission", v)} error={commission.error} suffix="$" placeholder="20000" />
          <NumberField label="Benefits & overhead / yr" value={values.benefits} onChange={(v) => update("benefits", v)} error={benefits.error} suffix="$" placeholder="10000" />
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
              label="Salesperson ROI"
              value={formatPercent(roi)}
              sub={`${formatCurrency(net, 0)} net contribution after their full ${formatCurrency(totalCost, 0)} cost`}
            />

            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                asset
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              }`}
            >
              {asset ? <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" /> : <IconX className="mt-0.5 h-4 w-4 shrink-0" />}
              <p>
                {asset
                  ? `An asset — every $1 spent on this salesperson returns ${formatCurrency(1 + roi / 100)} in gross profit.`
                  : `A cost center — their deals' gross profit does not cover their package yet. Coach, re-territory, or restructure the comp plan.`}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Gross profit on sales" value={formatCurrency(grossProfit, 0)} sub={`Revenue × ${formatPercent(margin.value!, 0)}`} />
              <MetricTile label="Total employment cost" value={formatCurrency(totalCost, 0)} sub="Salary + commission + benefits" />
              <MetricTile label="Net contribution" value={formatCurrency(net, 0)} sub="What they add to the bottom line" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter revenue and employment cost"
            description="Salesperson ROI and the asset verdict appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
