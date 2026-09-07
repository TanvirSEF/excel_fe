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
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = { price: "100", margin: "40" }

export function ReverseMarginCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const price = parseNumericInput(values.price, { min: 0.000001 })
  const margin = parseNumericInput(values.margin, { min: 0.01, max: 99 })

  const valid = price.value !== null && margin.value !== null
  const targetCost = valid ? price.value! * (1 - margin.value! / 100) : null
  const profit = valid && targetCost !== null ? price.value! - targetCost : 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Price-first planning</CardTitle>
          <CardDescription>
            The price is set by the market — this finds the most you can spend making it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Selling price" value={values.price} onChange={(v) => update("price", v)} error={price.error} suffix="$" placeholder="100" />
          <NumberField
            label="Target margin"
            value={values.margin}
            onChange={(v) => update("margin", v)}
            error={margin.error}
            hint="The margin your business needs to survive"
            suffix="%"
            placeholder="40"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && targetCost !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Target cost"
              value={formatCurrency(targetCost)}
              sub={`The maximum you can spend per unit to keep a ${formatPercent(margin.value!, 0)} margin`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Profit at target cost"
                value={formatCurrency(profit)}
                sub={`Price ${formatCurrency(price.value!)} − cost`}
              />
              <MetricTile
                label="Cost ceiling"
                value={formatPercent((targetCost / price.value!) * 100)}
                sub="Cost as a share of price"
              />
              <MetricTile
                label="Current typical cost"
                value={formatCurrency(targetCost * 1.1)}
                sub="10% over target — your negotiating room"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "Target cost = Price × (1 − margin%)" },
                {
                  title: "Substitute",
                  body: `${formatCurrency(price.value!)} × (1 − ${margin.value! / 100})`,
                },
                { title: "Result", body: `Target cost = ${formatCurrency(targetCost)}` },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              If your actual manufacturing cost is above the target, the product cannot
              hit its margin at this price — renegotiate sourcing or reprice.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter price and target margin"
            description="The maximum cost you can afford per unit appears here."
          />
        )}
      </div>
    </div>
  )
}
