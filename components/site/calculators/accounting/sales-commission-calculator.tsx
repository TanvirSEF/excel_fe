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
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = { sales: "100000", rate: "5", base: "0" }

export function SalesCommissionCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const sales = parseNumericInput(values.sales, { min: 0 })
  const rate = parseNumericInput(values.rate, { min: 0, max: 100 })
  const base = parseNumericInput(values.base, { min: 0 })

  const valid = sales.value !== null && rate.value !== null && base.value !== null
  const commission = valid ? (sales.value! * rate.value!) / 100 : 0
  const total = valid ? commission + base.value! : 0
  const effectiveRate = valid && sales.value! > 0 ? (total / sales.value!) * 100 : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sales & rate</CardTitle>
          <CardDescription>
            Straight commission math — percentage of sales, plus any fixed draw.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Sales amount" value={values.sales} onChange={(v) => update("sales", v)} error={sales.error} suffix="$" placeholder="100000" />
          <NumberField label="Commission rate" value={values.rate} onChange={(v) => update("rate", v)} error={rate.error} suffix="%" placeholder="5" />
          <NumberField label="Base / draw amount" value={values.base} onChange={(v) => update("base", v)} error={base.error} hint="Optional fixed component" suffix="$" placeholder="0" />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && effectiveRate !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Commission"
              value={formatCurrency(commission)}
              sub={`${formatPercent(rate.value!, 1)} of ${formatCurrency(sales.value!, 0)} in sales`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Total payout" value={formatCurrency(total)} sub="Commission + base" />
              <MetricTile label="Effective rate" value={formatPercent(effectiveRate, 2)} sub="Total payout ÷ sales" />
              <MetricTile label="Sales covered" value={formatCurrency(sales.value!, 0)} sub="The base for the calc" />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Tiered plans? Run this calculator once per tier — enter each tier&apos;s
              sales slice with its own rate and add the commissions.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter sales and commission rate"
            description="The exact commission appears here instantly."
          />
        )}
      </div>
    </div>
  )
}
