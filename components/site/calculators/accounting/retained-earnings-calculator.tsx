"use client"

import { useState } from "react"
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconRotate } from "@tabler/icons-react"

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

const DEFAULTS = { beginning: "10000", netIncome: "5000", dividends: "2000" }

export function RetainedEarningsCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const beginning = parseNumericInput(values.beginning, {})
  const netIncome = parseNumericInput(values.netIncome, {})
  const dividends = parseNumericInput(values.dividends, { min: 0 })

  const valid =
    beginning.value !== null && netIncome.value !== null && dividends.value !== null

  const ending = valid ? beginning.value! + netIncome.value! - dividends.value! : 0
  const netChange = valid ? ending - beginning.value! : 0
  const growth = netChange > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter retained earnings data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Beginning RE ($)" value={values.beginning} onChange={(v) => update("beginning", v)} error={beginning.error} hint="Start of period" suffix="$" placeholder="10000" />
          <NumberField label="Net income ($)" value={values.netIncome} onChange={(v) => update("netIncome", v)} error={netIncome.error} hint="Profit (Use – for Loss)" suffix="$" placeholder="5000" />
          <NumberField label="Dividends paid ($)" value={values.dividends} onChange={(v) => update("dividends", v)} error={dividends.error} hint="Cash distributed" suffix="$" placeholder="2000" />

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
              label="Ending retained earnings"
              value={formatCurrency(ending)}
            />

            {netChange > 0 ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Positive Trend: Earnings retained successfully.</p>
              </div>
            ) : netChange < 0 ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Negative Trend: Earnings are shrinking.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>No Change: Balance stayed the same.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Net change" value={`${netChange >= 0 ? "+" : "−"}${formatCurrency(Math.abs(netChange))}`} sub="Income − dividends" />
              <MetricTile label="Equity status" value={growth ? "Growth" : netChange < 0 ? "Decline" : "Flat"} sub={ending < 0 ? "Accumulated deficit" : "Retained balance healthy"} />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your retained earnings data"
            description="Your ending balance and equity status appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
