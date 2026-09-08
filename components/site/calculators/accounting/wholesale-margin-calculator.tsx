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
  cogs: "20",
  wholesaleMargin: "30",
  retailMargin: "50",
  shipping: "0",
  commission: "0",
  quantity: "100",
  tax: "0",
}

export function WholesaleMarginCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const cogs = parseNumericInput(values.cogs, { min: 0.000001 })
  const wholesaleMargin = parseNumericInput(values.wholesaleMargin, { min: 0.01, max: 99.99 })
  const retailMargin = parseNumericInput(values.retailMargin, { min: 0.01, max: 99.99 })
  const shipping = parseNumericInput(values.shipping, { min: 0 })
  const commission = parseNumericInput(values.commission, { min: 0, max: 99.99 })
  const quantity = parseNumericInput(values.quantity, { min: 1, integer: true })
  const tax = parseNumericInput(values.tax, { min: 0, max: 100 })

  const valid = [cogs, wholesaleMargin, retailMargin, shipping, commission, quantity, tax].every(
    (field) => field.value !== null
  )

  const denominator = valid
    ? 1 - (wholesaleMargin.value! + commission.value!) / 100
    : 0
  const wholesalePrice =
    valid && denominator > 0 ? (cogs.value! + shipping.value!) / denominator : 0
  const commissionAmount = valid ? wholesalePrice * (commission.value! / 100) : 0
  const unitProfit = valid
    ? wholesalePrice - cogs.value! - shipping.value! - commissionAmount
    : 0
  const msrp = valid ? wholesalePrice / (1 - retailMargin.value! / 100) : 0
  const totalProfit = valid ? unitProfit * quantity.value! : 0
  const orderValueWithTax = valid
    ? wholesalePrice * quantity.value! * (1 + tax.value! / 100)
    : 0
  const healthy = wholesaleMargin.value! >= 20

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter pricing data matrix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Core pricing &amp; margins
          </p>
          <NumberField label="Unit cost (COGS)" value={values.cogs} onChange={(v) => update("cogs", v)} error={cogs.error} hint="Product baseline" suffix="$" placeholder="20" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Wholesale margin (%)" value={values.wholesaleMargin} onChange={(v) => update("wholesaleMargin", v)} error={wholesaleMargin.error} hint="Your target profit" suffix="%" placeholder="30" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Retail margin (%)" value={values.retailMargin} onChange={(v) => update("retailMargin", v)} error={retailMargin.error} hint="MSRP store margin" suffix="%" placeholder="50" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Wholesale adjustments
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Shipping cost ($)" value={values.shipping} onChange={(v) => update("shipping", v)} error={shipping.error} suffix="$" placeholder="0" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Sales commission (%)" value={values.commission} onChange={(v) => update("commission", v)} error={commission.error} suffix="%" placeholder="0" />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Order quantity" value={values.quantity} onChange={(v) => update("quantity", v)} error={quantity.error} placeholder="100" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Sales tax (%)" value={values.tax} onChange={(v) => update("tax", v)} error={tax.error} suffix="%" placeholder="0" />
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
              label="Wholesale price"
              value={formatCurrency(wholesalePrice)}
            />

            {healthy ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Healthy Chain: Sustainable margins for all parties.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Thin Margins: Risky for the long run.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="MSRP" value={formatCurrency(msrp)} sub="Suggested retail price" />
              <MetricTile label="Unit profit" value={formatCurrency(unitProfit)} sub="Wholesale − costs − commission" />
              <MetricTile label="Total profit" value={formatCurrency(totalProfit)} sub={`Unit profit × ${quantity.value} units`} />
              <MetricTile label="Order value + tax" value={formatCurrency(orderValueWithTax)} sub="Wholesale × qty + tax" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your pricing data"
            description="Wholesale price, MSRP and profit appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
