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

const DEFAULTS = { profit: "20000", investment: "100000", salvage: "10000" }

export function AccountingRateOfReturnCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const profit = parseNumericInput(values.profit, { min: 0 })
  const investment = parseNumericInput(values.investment, { min: 1 })
  const salvage = parseNumericInput(values.salvage, { min: 0 })

  const valid = profit.value !== null && investment.value !== null && salvage.value !== null

  const avgInvestment = valid ? (investment.value! + salvage.value!) / 2 : 0
  const arr = valid && avgInvestment > 0 ? (profit.value! / avgInvestment) * 100 : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Project snapshot</CardTitle>
          <CardDescription>
            The accounting lens — average profit against average investment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Average annual profit"
            value={values.profit}
            onChange={(v) => update("profit", v)}
            error={profit.error}
            hint="After depreciation and tax"
            suffix="$"
            placeholder="20000"
          />
          <NumberField
            label="Initial investment"
            value={values.investment}
            onChange={(v) => update("investment", v)}
            error={investment.error}
            suffix="$"
            placeholder="100000"
          />
          <NumberField
            label="Salvage value"
            value={values.salvage}
            onChange={(v) => update("salvage", v)}
            error={salvage.error}
            hint="What the asset is worth at the end"
            suffix="$"
            placeholder="10000"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && arr !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Accounting rate of return"
              value={formatPercent(arr)}
              sub="Average annual profit ÷ average investment"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Average investment"
                value={formatCurrency(avgInvestment, 0)}
                sub="(Initial + salvage) ÷ 2"
              />
              <MetricTile
                label="Annual profit"
                value={formatCurrency(profit.value!, 0)}
                sub="The numerator"
              />
              <MetricTile
                label={arr >= 15 ? "Verdict" : "Verdict"}
                value={arr >= 15 ? "Approve" : "Review"}
                sub={arr >= 15 ? "Above the common 15% hurdle" : "Below the common 15% hurdle — compare with your required rate"}
              />
            </div>

            <StepList
              steps={[
                {
                  title: "Average investment",
                  body: `(${formatCurrency(investment.value!, 0)} + ${formatCurrency(salvage.value!, 0)}) ÷ 2 = ${formatCurrency(avgInvestment, 0)}`,
                },
                {
                  title: "ARR",
                  body: `${formatCurrency(profit.value!, 0)} ÷ ${formatCurrency(avgInvestment, 0)} = ${formatPercent(arr)}`,
                },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter profit and investment"
            description="The ARR — the quick approval check managers use — appears here."
          />
        )}
      </div>
    </div>
  )
}
