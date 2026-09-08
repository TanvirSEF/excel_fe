"use client"

import { useState } from "react"
import { IconAlertTriangle, IconCircleCheck, IconRocket, IconRotate } from "@tabler/icons-react"

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
import { formatDecimal } from "@/lib/format"

const DEFAULTS = {
  period: "365",
  revenue: "1000000",
  cogs: "600000",
  inventory: "50000",
  receivable: "40000",
  payable: "30000",
}

export function CashConversionCycleCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const period = parseNumericInput(values.period, { min: 1 })
  const revenue = parseNumericInput(values.revenue, { min: 0.000001 })
  const cogs = parseNumericInput(values.cogs, { min: 0.000001 })
  const inventory = parseNumericInput(values.inventory, { min: 0 })
  const receivable = parseNumericInput(values.receivable, { min: 0 })
  const payable = parseNumericInput(values.payable, { min: 0 })

  const valid = [period, revenue, cogs, inventory, receivable, payable].every(
    (field) => field.value !== null
  )

  const dio = valid ? (inventory.value! / cogs.value!) * period.value! : 0
  const dso = valid ? (receivable.value! / revenue.value!) * period.value! : 0
  const dpo = valid ? (payable.value! / cogs.value!) * period.value! : 0
  const ccc = valid ? dio + dso - dpo : 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Analyze cash flow efficiency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Period length (days)" value={values.period} onChange={(v) => update("period", v)} error={period.error} placeholder="365" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Sales &amp; costs
          </p>
          <NumberField label="Total revenue ($)" value={values.revenue} onChange={(v) => update("revenue", v)} error={revenue.error} suffix="$" placeholder="1000000" />
          <NumberField label="Cost of goods sold ($)" value={values.cogs} onChange={(v) => update("cogs", v)} error={cogs.error} suffix="$" placeholder="600000" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Working capital
          </p>
          <NumberField label="Average inventory" value={values.inventory} onChange={(v) => update("inventory", v)} error={inventory.error} suffix="$" placeholder="50000" />
          <NumberField label="Accounts receivable" value={values.receivable} onChange={(v) => update("receivable", v)} error={receivable.error} suffix="$" placeholder="40000" />
          <NumberField label="Accounts payable" value={values.payable} onChange={(v) => update("payable", v)} error={payable.error} suffix="$" placeholder="30000" />

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
              label="Cash conversion cycle"
              value={`${formatDecimal(ccc, 1)} Days`}
            />

            {ccc < 0 ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconRocket className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Negative CCC: Customers pay before you pay suppliers.</p>
              </div>
            ) : ccc <= 30 ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Efficient: Your cash is tied up for only {Math.round(ccc)} days.</p>
              </div>
            ) : ccc <= 60 ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Moderate: Your cash is tied up for {Math.round(ccc)} days.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Slow: Your cash is tied up for {Math.round(ccc)} days.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="(+) DIO" value={formatDecimal(dio, 1)} sub="Inventory days" />
              <MetricTile label="(+) DSO" value={formatDecimal(dso, 1)} sub="Receivable days" />
              <MetricTile label="(−) DPO" value={formatDecimal(dpo, 1)} sub="Payable days" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your cash flow data"
            description="Your cash conversion cycle and its components appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
