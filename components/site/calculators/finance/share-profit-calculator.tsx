"use client"

import { useState } from "react"
import { IconAlertTriangle, IconCircleCheck, IconRotate } from "@tabler/icons-react"

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

const DEFAULTS = {
  shares: "100",
  buy: "150",
  sell: "200",
  buyComm: "10",
  sellComm: "10",
  taxRate: "15",
}

export function ShareProfitCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const shares = parseNumericInput(values.shares, { min: 1 })
  const buy = parseNumericInput(values.buy, { min: 0.000001 })
  const sell = parseNumericInput(values.sell, { min: 0 })
  const buyComm = parseNumericInput(values.buyComm, { min: 0 })
  const sellComm = parseNumericInput(values.sellComm, { min: 0 })
  const taxRate = parseNumericInput(values.taxRate, { min: 0, max: 100 })

  const valid = [shares, buy, sell, buyComm, sellComm, taxRate].every(
    (f) => f.value !== null
  )

  const totalCost = valid ? shares.value! * buy.value! + buyComm.value! : 0
  const gross = valid ? shares.value! * sell.value! : 0
  const netRevenue = valid ? gross - sellComm.value! : 0
  const taxableProfit = netRevenue - totalCost
  const tax = valid && taxableProfit > 0 ? taxableProfit * (taxRate.value! / 100) : 0
  const netProfit = taxableProfit - tax
  const roi = valid && totalCost > 0 ? (netProfit / totalCost) * 100 : null
  const totalFees = valid ? buyComm.value! + sellComm.value! + tax : 0
  const breakEven = valid && shares.value! > 0 ? totalCost / shares.value! : null
  const profitable = netProfit > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter stock trade details</CardTitle>
          <CardDescription>
            Both commissions and the capital gains tax rate — every cost that eats into
            your profit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Shares quantity" value={values.shares} onChange={(v) => update("shares", v)} error={shares.error} placeholder="100" />
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Buy price ($)" value={values.buy} onChange={(v) => update("buy", v)} error={buy.error} suffix="$" placeholder="150.00" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Sell price ($)" value={values.sell} onChange={(v) => update("sell", v)} error={sell.error} suffix="$" placeholder="200.00" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Buy commission ($)" value={values.buyComm} onChange={(v) => update("buyComm", v)} error={buyComm.error} suffix="$" placeholder="10" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Sell commission ($)" value={values.sellComm} onChange={(v) => update("sellComm", v)} error={sellComm.error} suffix="$" placeholder="10" />
            </div>
          </div>
          <NumberField
            label="Tax rate (%)"
            value={values.taxRate}
            onChange={(v) => update("taxRate", v)}
            error={taxRate.error}
            hint="Capital gains tax — 0%, 15% or 20% in the US (long-term)"
            suffix="%"
            placeholder="15"
          />
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
              label={profitable ? "Net profit" : "Net loss"}
              value={formatCurrency(Math.abs(netProfit))}
              sub={`After ${formatCurrency(totalFees)} in fees and taxes · ${formatPercent(roi)} ROI`}
            />

            {profitable ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Profitable trade — a good return on investment after all costs.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Net loss — you sold below total cost. You may be able to use this
                  capital loss to offset other gains for tax purposes.
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="ROI (post-tax)" value={formatPercent(roi)} sub="Net profit ÷ total cost" />
              <MetricTile label="Total cost" value={formatCurrency(totalCost)} sub={`Shares × buy + ${formatCurrency(buyComm.value!)} commission`} />
              <MetricTile label="Revenue (gross)" value={formatCurrency(gross)} sub="Shares × sell price" />
              <MetricTile label="Total fees & tax" value={formatCurrency(totalFees)} sub={`$${buyComm.value!} + $${sellComm.value!} comm + ${formatCurrency(tax)} tax`} />
            </div>

            <StepList
              steps={[
                { title: "Total cost basis", body: `${shares.value} × ${formatCurrency(buy.value!)} + ${formatCurrency(buyComm.value!)} = ${formatCurrency(totalCost)}` },
                { title: "Gross proceeds", body: `${shares.value} × ${formatCurrency(sell.value!)} = ${formatCurrency(gross)}` },
                { title: "Net revenue", body: `${formatCurrency(gross)} − ${formatCurrency(sellComm.value!)} = ${formatCurrency(netRevenue)}` },
                {
                  title: "Tax liability",
                  body: taxableProfit > 0
                    ? `(${formatCurrency(netRevenue)} − ${formatCurrency(totalCost)}) × ${taxRate.value!}% = ${formatCurrency(tax)}`
                    : "No profit — no capital gains tax due",
                },
                {
                  title: "Net profit / loss",
                  body: `${formatCurrency(taxableProfit)} − ${formatCurrency(tax)} = ${formatCurrency(netProfit)}`,
                },
              ]}
            />

            {breakEven !== null ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Break-even price: {formatCurrency(breakEven)} per share — the minimum
                sell price that covers all buying costs. Below this, the trade loses
                money before commissions and taxes.
              </p>
            ) : null}
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your trade details"
            description="Net profit after commissions and taxes, plus ROI and break-even — appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
