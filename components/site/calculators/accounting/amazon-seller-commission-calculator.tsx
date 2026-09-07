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

const DEFAULTS = { price: "100", referral: "15", fulfillment: "8", closing: "0", cost: "40" }

export function AmazonSellerCommissionCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const price = parseNumericInput(values.price, { min: 0.01 })
  const referral = parseNumericInput(values.referral, { min: 0, max: 100 })
  const fulfillment = parseNumericInput(values.fulfillment, { min: 0 })
  const closing = parseNumericInput(values.closing, { min: 0 })
  const cost = parseNumericInput(values.cost, { min: 0 })

  const valid = [price, referral, fulfillment, closing, cost].every((f) => f.value !== null)

  const referralFee = valid ? (price.value! * referral.value!) / 100 : 0
  const totalFees = valid ? referralFee + fulfillment.value! + closing.value! : 0
  const proceeds = valid ? price.value! - totalFees : 0
  const feePct = valid && price.value! > 0 ? (totalFees / price.value!) * 100 : null
  const profit = valid ? proceeds - cost.value! : 0
  const profitMargin = valid && price.value! > 0 ? (profit / price.value!) * 100 : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sale details</CardTitle>
          <CardDescription>
            Amazon changes fees often — enter the current rates from Seller Central.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Sale price" value={values.price} onChange={(v) => update("price", v)} error={price.error} suffix="$" placeholder="100" />
          <NumberField label="Referral fee" value={values.referral} onChange={(v) => update("referral", v)} error={referral.error} hint="Most categories: 8–15%" suffix="%" placeholder="15" />
          <NumberField label="Fulfillment fee (FBA)" value={values.fulfillment} onChange={(v) => update("fulfillment", v)} error={fulfillment.error} hint="Per unit — pick & pack + shipping" suffix="$" placeholder="8" />
          <NumberField label="Closing fee / per-item" value={values.closing} onChange={(v) => update("closing", v)} error={closing.error} suffix="$" placeholder="0" />
          <NumberField label="Your product cost" value={values.cost} onChange={(v) => update("cost", v)} error={cost.error} suffix="$" placeholder="40" />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && feePct !== null && profitMargin !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="You actually keep"
              value={formatCurrency(profit)}
              sub={`${formatPercent(profitMargin, 1)} net margin after fees and product cost`}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Referral fee" value={formatCurrency(referralFee)} sub={`${referral.value}% of the sale`} />
              <MetricTile
                label="Total Amazon fees"
                value={formatCurrency(totalFees)}
                sub={`${formatPercent(feePct, 1)} of the sale price`}
              />
              <MetricTile label="Net proceeds" value={formatCurrency(proceeds)} sub="What Amazon pays you" />
              <MetricTile label="Break-even price" value={formatCurrency(cost.value! + totalFees)} sub="Covers cost + fees at this fee level" />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Fee percentages vary by category and Amazon adjusts them often — always
              confirm current rates in Seller Central before pricing a product.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter the sale and fees"
            description="Amazon's cut, your proceeds and true profit appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
