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
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = {
  salary: "50000",
  commissionRate: "10",
  revenue: "300000",
  margin: "40",
  benefits: "0",
  opex: "0",
}

export function SalespersonProfitabilityCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const salary = parseNumericInput(values.salary, { min: 0 })
  const commissionRate = parseNumericInput(values.commissionRate, { min: 0, max: 100 })
  const revenue = parseNumericInput(values.revenue, { min: 0 })
  const margin = parseNumericInput(values.margin, { min: 0.01, max: 100 })
  const benefits = parseNumericInput(values.benefits, { min: 0 })
  const opex = parseNumericInput(values.opex, { min: 0 })

  const valid = [salary, commissionRate, revenue, margin, benefits, opex].every(
    (field) => field.value !== null
  )

  const commission = valid ? revenue.value! * (commissionRate.value! / 100) : 0
  const totalEmpCost = valid
    ? salary.value! + commission + benefits.value! + opex.value!
    : 0
  const grossProfit = valid ? revenue.value! * (margin.value! / 100) : 0
  const netContribution = valid ? grossProfit - totalEmpCost : 0
  const effectiveMargin = valid ? (margin.value! - commissionRate.value!) / 100 : 0
  const breakEvenSales =
    valid && effectiveMargin > 0
      ? (salary.value! + benefits.value! + opex.value!) / effectiveMargin
      : null
  const roi = valid && totalEmpCost > 0 ? (netContribution / totalEmpCost) * 100 : null
  const profitable = netContribution > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Input performance metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Compensation plan
          </p>
          <NumberField label="Base salary ($)" value={values.salary} onChange={(v) => update("salary", v)} error={salary.error} hint="Annual fixed cost" suffix="$" placeholder="50000" />
          <NumberField label="Commission rate (%)" value={values.commissionRate} onChange={(v) => update("commissionRate", v)} error={commissionRate.error} hint="Paid on revenue" suffix="%" placeholder="10" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Performance &amp; overhead
          </p>
          <NumberField label="Total revenue ($)" value={values.revenue} onChange={(v) => update("revenue", v)} error={revenue.error} suffix="$" placeholder="300000" />
          <NumberField label="Gross margin (%)" value={values.margin} onChange={(v) => update("margin", v)} error={margin.error} suffix="%" placeholder="40" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Benefits &amp; taxes ($)" value={values.benefits} onChange={(v) => update("benefits", v)} error={benefits.error} suffix="$" placeholder="0" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Operating expenses ($)" value={values.opex} onChange={(v) => update("opex", v)} error={opex.error} suffix="$" placeholder="0" />
            </div>
          </div>

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
              label="Net contribution (profit)"
              value={formatCurrency(netContribution, 0)}
            />

            {profitable ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Profitable: Employee is an asset.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Unprofitable: Employee costs exceed gross profit.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Total emp. cost" value={formatCurrency(totalEmpCost, 0)} sub="Salary + commission + benefits" />
              <MetricTile label="Break-even sales" value={breakEvenSales !== null ? formatCurrency(breakEvenSales, 0) : "—"} sub="Effective margin after commission" />
              <MetricTile label="Return on investment (ROI)" value={roi !== null ? formatPercent(roi, 1) : "—"} sub="Contribution ÷ total cost" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your performance metrics"
            description="Net contribution, break-even sales and ROI appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
