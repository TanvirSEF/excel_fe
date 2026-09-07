"use client"

import { useState } from "react"
import { IconCircleCheck, IconRotate, IconX } from "@tabler/icons-react"

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

const DEFAULTS = { spend: "5000", revenue: "15000" }

export function MarketingRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const spend = parseNumericInput(values.spend, { min: 0.000001 })
  const revenue = parseNumericInput(values.revenue, { min: 0 })

  const valid = spend.value !== null && revenue.value !== null
  const profit = valid ? revenue.value! - spend.value! : 0
  const roi = valid ? (profit / spend.value!) * 100 : null
  const roas = valid ? revenue.value! / spend.value! : null
  const winner = profit > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Campaign numbers</CardTitle>
          <CardDescription>
            What you spent on the campaign and the revenue it brought in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Marketing spend"
            value={values.spend}
            onChange={(v) => update("spend", v)}
            error={spend.error}
            suffix="$"
            placeholder="5000"
          />
          <NumberField
            label="Attributed revenue"
            value={values.revenue}
            onChange={(v) => update("revenue", v)}
            error={revenue.error}
            hint="Sales this campaign generated"
            suffix="$"
            placeholder="15000"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && roi !== null && roas !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Marketing ROI"
              value={formatPercent(roi)}
              sub={`${formatCurrency(profit)} net ${profit >= 0 ? "profit" : "loss"} on ${formatCurrency(spend.value!)} spent`}
            />

            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                winner
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              }`}
            >
              {winner ? <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" /> : <IconX className="mt-0.5 h-4 w-4 shrink-0" />}
              <p>
                {winner
                  ? `Winner — every $1 of ad spend returned ${formatCurrency(roas)}, clearing costs with ${formatPercent(roi)} profit on top.`
                  : `Loser — the campaign brought back only ${formatCurrency(roas)} per $1 spent. Cut it or fix the targeting.`}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Net profit" value={formatCurrency(profit)} sub="Revenue − spend" />
              <MetricTile label="ROAS" value={`${formatCurrency(roas)}`} sub="Revenue per $1 of spend" />
              <MetricTile
                label="Break-even revenue"
                value={formatCurrency(spend.value!)}
                sub="What the campaign must earn to wash"
              />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter spend and revenue"
            description="ROI, verdict and return per dollar appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
