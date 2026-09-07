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

const DEFAULTS = { buy: "50", sell: "65", shares: "100", fee: "0" }

export function ShareProfitCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const buy = parseNumericInput(values.buy, { min: 0.000001 })
  const sell = parseNumericInput(values.sell, { min: 0 })
  const shares = parseNumericInput(values.shares, { min: 1 })
  const fee = parseNumericInput(values.fee, { min: 0 })

  const valid =
    buy.value !== null && sell.value !== null && shares.value !== null && fee.value !== null

  const grossProfit = valid ? (sell.value! - buy.value!) * shares.value! : 0
  const profit = valid ? grossProfit - fee.value! : 0
  const cost = valid ? buy.value! * shares.value! + fee.value! : 0
  const roi = valid && cost > 0 ? (profit / cost) * 100 : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your trade</CardTitle>
          <CardDescription>
            What you paid, what you sold for, and any brokerage fees.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Buy price" value={values.buy} onChange={(v) => update("buy", v)} error={buy.error} suffix="$" placeholder="50" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Sell price" value={values.sell} onChange={(v) => update("sell", v)} error={sell.error} suffix="$" placeholder="65" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Shares" value={values.shares} onChange={(v) => update("shares", v)} error={shares.error} placeholder="100" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Total fees" value={values.fee} onChange={(v) => update("fee", v)} error={fee.error} suffix="$" placeholder="0" />
            </div>
          </div>
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
              label={profit >= 0 ? "Total profit" : "Total loss"}
              value={formatCurrency(Math.abs(profit))}
              sub={`${formatPercent(roi)} return on your ${formatCurrency(cost)} invested`}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Per-share gain"
                value={formatCurrency(sell.value! - buy.value!)}
                sub={`Sold at ${formatCurrency(sell.value!)} − bought at ${formatCurrency(buy.value!)}`}
              />
              <MetricTile
                label="Gross profit"
                value={formatCurrency(grossProfit)}
                sub="Before fees"
              />
              <MetricTile
                label="Break-even sell price"
                value={formatCurrency((buy.value! * shares.value! + fee.value!) / shares.value!)}
                sub="Price covering cost + fees"
              />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your buy and sell prices"
            description="Profit, ROI percentage and the break-even price appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
