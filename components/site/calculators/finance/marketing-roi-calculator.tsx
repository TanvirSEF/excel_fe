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
import { formatCurrency, formatDecimal, formatPercent } from "@/lib/format"

const DEFAULTS = {
  spend: "5000",
  labor: "2000",
  cogs: "30",
  revenue: "25000",
  clv: "1200",
  retention: "85",
}

export function MarketingRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const spend = parseNumericInput(values.spend, { min: 0 })
  const labor = parseNumericInput(values.labor, { min: 0 })
  const cogs = parseNumericInput(values.cogs, { min: 0, max: 100 })
  const revenue = parseNumericInput(values.revenue, { min: 0 })
  const clv = parseNumericInput(values.clv, { min: 0.000001 })
  const retention = parseNumericInput(values.retention, { min: 0, max: 99.99 })

  const valid = [spend, labor, cogs, revenue, clv, retention].every(
    (field) => field.value !== null
  )

  const totalSpend = valid ? spend.value! + labor.value! : 0
  const grossMargin = valid ? revenue.value! * (1 - cogs.value! / 100) : 0
  const netProfit = valid ? grossMargin - totalSpend : 0
  const roi = valid && totalSpend > 0 ? (netProfit / totalSpend) * 100 : null
  const roas = valid && spend.value! > 0 ? revenue.value! / spend.value! : null
  const breakEvenRevenue =
    valid && cogs.value! < 100 ? totalSpend / (1 - cogs.value! / 100) : null
  const profitable = netProfit > 0

  const customersAcquired = valid ? revenue.value! / clv.value! : 0
  const cac = valid && customersAcquired > 0 ? totalSpend / customersAcquired : null
  const ltvToCac = valid && cac !== null && cac > 0 ? clv.value! / cac : null
  const customerLifetimeYears =
    valid ? 1 / (1 - retention.value! / 100) : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter campaign financials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Campaign spend &amp; costs
          </p>
          <NumberField label="Marketing spend ($)" value={values.spend} onChange={(v) => update("spend", v)} error={spend.error} suffix="$" placeholder="5000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Labor &amp; admin cost ($)" value={values.labor} onChange={(v) => update("labor", v)} error={labor.error} suffix="$" placeholder="2000" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Cost of goods sold (%)" value={values.cogs} onChange={(v) => update("cogs", v)} error={cogs.error} suffix="%" placeholder="30" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Revenue &amp; performance
          </p>
          <NumberField label="Gross revenue ($)" value={values.revenue} onChange={(v) => update("revenue", v)} error={revenue.error} suffix="$" placeholder="25000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Customer lifetime value ($)" value={values.clv} onChange={(v) => update("clv", v)} error={clv.error} suffix="$" placeholder="1200" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Retention rate (%)" value={values.retention} onChange={(v) => update("retention", v)} error={retention.error} suffix="%" placeholder="85" />
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && roi !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Annual return yield"
              value={formatPercent(roi, 0)}
              sub={`${formatCurrency(netProfit, 0)}/yr`}
            />

            {profitable ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Campaign Success: Positive yield generated.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Campaign Loss: No positive yield generated.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Total spend" value={formatCurrency(totalSpend, 0)} sub="Ads + labor & admin" />
              <MetricTile label="Gross margin" value={formatCurrency(grossMargin, 0)} sub="Revenue after COGS" />
              <MetricTile label="Return on ad spend (ROAS)" value={roas !== null ? `${formatDecimal(roas, 2)}x` : "—"} sub="Revenue ÷ ad spend" />
              <MetricTile label="Break even revenue" value={breakEvenRevenue !== null ? formatCurrency(breakEvenRevenue, 0) : "—"} sub="Where margin covers spend" />
              <MetricTile label="LTV : CAC" value={ltvToCac !== null ? `${formatDecimal(ltvToCac, 2)} : 1` : "—"} sub={cac !== null ? `CAC ${formatCurrency(cac, 0)} vs CLV — 3:1 or better is healthy` : "—"} />
              <MetricTile label="Expected customer lifetime" value={customerLifetimeYears !== null ? `${formatDecimal(customerLifetimeYears, 1)} yrs` : "—"} sub="From your retention rate" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your campaign financials"
            description="Return yield, ROAS and break-even revenue appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
