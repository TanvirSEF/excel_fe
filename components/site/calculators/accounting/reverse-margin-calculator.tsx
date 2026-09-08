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
import { formatCurrency } from "@/lib/format"

const DEFAULTS = {
  price: "100",
  margin: "40",
  tax: "0",
  discount: "0",
  freight: "0",
}

export function ReverseMarginCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const price = parseNumericInput(values.price, { min: 0.000001 })
  const margin = parseNumericInput(values.margin, { min: 0.01, max: 99.99 })
  const tax = parseNumericInput(values.tax, { min: 0, max: 100 })
  const discount = parseNumericInput(values.discount, { min: 0, max: 99.99 })
  const freight = parseNumericInput(values.freight, { min: 0 })

  const valid = [price, margin, tax, discount, freight].every(
    (field) => field.value !== null
  )

  const netSellPrice = valid
    ? (price.value! / (1 + tax.value! / 100)) * (1 - discount.value! / 100)
    : 0
  const maxLandedCost = valid ? netSellPrice * (1 - margin.value! / 100) : 0
  const maxProductCost = valid ? maxLandedCost - freight.value! : 0
  const grossProfit = valid ? netSellPrice - maxLandedCost : 0
  const feasible = maxProductCost > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter pricing &amp; margin data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pricing targets
          </p>
          <NumberField label="Target sell price ($)" value={values.price} onChange={(v) => update("price", v)} error={price.error} suffix="$" placeholder="100" />
          <NumberField label="Required margin (%)" value={values.margin} onChange={(v) => update("margin", v)} error={margin.error} suffix="%" placeholder="40" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cost adjustments
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Tax included (%)" value={values.tax} onChange={(v) => update("tax", v)} error={tax.error} suffix="%" placeholder="0" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Planned discount (%)" value={values.discount} onChange={(v) => update("discount", v)} error={discount.error} suffix="%" placeholder="0" />
            </div>
          </div>
          <NumberField label="Freight &amp; duty cost ($)" value={values.freight} onChange={(v) => update("freight", v)} error={freight.error} suffix="$" placeholder="0" />

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
              label="Max product cost (FOB)"
              value={formatCurrency(maxProductCost)}
            />

            {feasible ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Target Feasible: Sourcing limit defined.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Target Infeasible: Price cannot cover costs.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Max landed cost" value={formatCurrency(maxLandedCost)} sub="Before freight & duty" />
              <MetricTile label="Gross profit" value={formatCurrency(grossProfit)} sub="Net sell − landed cost" />
              <MetricTile label="Net sell price" value={formatCurrency(netSellPrice)} sub="After tax & discount" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your pricing targets"
            description="Your maximum product cost appears here instantly."
          />
        )}
      </div>
    </div>
  )
}
