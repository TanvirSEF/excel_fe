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

const DEFAULTS = { cost: "60", price: "100" }

export function RetailProfitMarginCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const cost = parseNumericInput(values.cost, { min: 0.000001 })
  const price = parseNumericInput(values.price, { min: 0.000001 })

  const valid = cost.value !== null && price.value !== null
  const profit = valid ? price.value! - cost.value! : 0
  const margin = valid ? (profit / price.value!) * 100 : null
  const markup = valid ? (profit / cost.value!) * 100 : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>One product</CardTitle>
          <CardDescription>
            What the product costs you and what your shelf price is.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Unit cost" value={values.cost} onChange={(v) => update("cost", v)} error={cost.error} hint="What you pay your supplier" suffix="$" placeholder="60" />
          <NumberField label="Selling price" value={values.price} onChange={(v) => update("price", v)} error={price.error} suffix="$" placeholder="100" />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && margin !== null && markup !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Profit margin"
              value={formatPercent(margin)}
              sub={`${formatCurrency(profit)} kept from every ${formatCurrency(price.value!)} sale`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Profit per unit" value={formatCurrency(profit)} sub="Price − cost" />
              <MetricTile label="Markup" value={formatPercent(markup)} sub="Profit as a share of cost" />
              <MetricTile
                label="Cost ratio"
                value={formatPercent((cost.value! / price.value!) * 100)}
                sub="Share of price eaten by cost"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "Margin = (Price − Cost) ÷ Price × 100%" },
                {
                  title: "Substitute",
                  body: `(${formatCurrency(price.value!)} − ${formatCurrency(cost.value!)}) ÷ ${formatCurrency(price.value!)}`,
                },
                { title: "Result", body: `Margin = ${formatPercent(margin)}` },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Retail margins vary wildly by category — groceries run 1–3% while
              accessories often clear 50%+. Compare within your own category, not across
              the whole store.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter cost and selling price"
            description="Margin, markup and profit per unit appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
