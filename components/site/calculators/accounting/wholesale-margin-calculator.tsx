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
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format"

const DEFAULTS = { unitCost: "5", quantity: "1000", bulkPrice: "7000" }

export function WholesaleMarginCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const unitCost = parseNumericInput(values.unitCost, { min: 0.000001 })
  const quantity = parseNumericInput(values.quantity, { min: 1 })
  const bulkPrice = parseNumericInput(values.bulkPrice, { min: 0.000001 })

  const valid = unitCost.value !== null && quantity.value !== null && bulkPrice.value !== null

  const totalCost = valid ? unitCost.value! * quantity.value! : 0
  const profit = valid ? bulkPrice.value! - totalCost : 0
  const margin = valid && bulkPrice.value! > 0 ? (profit / bulkPrice.value!) * 100 : null
  const effectiveUnitPrice = valid ? bulkPrice.value! / quantity.value! : 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>The bulk deal</CardTitle>
          <CardDescription>
            Manufacturing cost per unit, the quantity in the bulk, and the price you charge for it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Cost per unit" value={values.unitCost} onChange={(v) => update("unitCost", v)} error={unitCost.error} suffix="$" placeholder="5" />
          <NumberField label="Units in the bulk" value={values.quantity} onChange={(v) => update("quantity", v)} error={quantity.error} placeholder="1000" />
          <NumberField label="Bulk selling price" value={values.bulkPrice} onChange={(v) => update("bulkPrice", v)} error={bulkPrice.error} hint="What the store pays you for the whole lot" suffix="$" placeholder="7000" />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && margin !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Wholesale margin"
              value={formatPercent(margin)}
              sub={`${formatCurrency(profit, 0)} profit on the whole ${formatCurrency(bulkPrice.value!, 0)} deal`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Total cost" value={formatCurrency(totalCost, 0)} sub={`${
                formatNumber(quantity.value!)
              } units × ${formatCurrency(unitCost.value!)}`} />
              <MetricTile label="Bulk profit" value={formatCurrency(profit, 0)} sub="Price − total cost" />
              <MetricTile
                label="Effective unit price"
                value={formatCurrency(effectiveUnitPrice)}
                sub={`${formatCurrency(effectiveUnitPrice - unitCost.value!)} margin per unit`}
              />
            </div>

            <StepList
              steps={[
                { title: "Total cost", body: `${formatNumber(quantity.value!)} × ${formatCurrency(unitCost.value!)} = ${formatCurrency(totalCost, 0)}` },
                { title: "Profit", body: `${formatCurrency(bulkPrice.value!, 0)} − ${formatCurrency(totalCost, 0)} = ${formatCurrency(profit, 0)}` },
                { title: "Margin", body: `${formatCurrency(profit, 0)} ÷ ${formatCurrency(bulkPrice.value!, 0)} = ${formatPercent(margin)}` },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter the bulk deal"
            description="Wholesale margin, total profit and effective unit price appear here."
          />
        )}
      </div>
    </div>
  )
}
