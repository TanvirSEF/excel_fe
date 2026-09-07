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

const DEFAULTS = { expenses: "4000", yieldPct: "4", savings: "400000" }

export function LivingOffDividendsCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const expenses = parseNumericInput(values.expenses, { min: 1 })
  const yieldPct = parseNumericInput(values.yieldPct, { min: 0.01, max: 100 })
  const savings = parseNumericInput(values.savings, { min: 0 })

  const valid =
    expenses.value !== null && yieldPct.value !== null && savings.value !== null

  const goal = valid ? (expenses.value! * 12) / (yieldPct.value! / 100) : null
  const income = valid ? (savings.value! * yieldPct.value!) / 100 : null
  const gap = valid && goal !== null && income !== null ? goal - savings.value! : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your target lifestyle</CardTitle>
          <CardDescription>
            The portfolio you need to live entirely on dividend income.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Monthly expenses"
            value={values.expenses}
            onChange={(v) => update("expenses", v)}
            error={expenses.error}
            suffix="$"
            placeholder="4000"
          />
          <NumberField
            label="Portfolio dividend yield"
            value={values.yieldPct}
            onChange={(v) => update("yieldPct", v)}
            error={yieldPct.error}
            hint="Typical dividend portfolios yield 2–6%"
            suffix="%"
            placeholder="4"
          />
          <NumberField
            label="Current savings"
            value={values.savings}
            onChange={(v) => update("savings", v)}
            error={savings.error}
            suffix="$"
            placeholder="400000"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && goal !== null && income !== null && gap !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Goal portfolio"
              value={formatCurrency(goal)}
              sub={`Covers ${formatCurrency(expenses.value! * 12)} of annual expenses at ${formatPercent(yieldPct.value!, 1)} yield`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Income today"
                value={formatCurrency(income)}
                sub={`${formatCurrency(income / 12)} per month`}
              />
              <MetricTile
                label={gap > 0 ? "Still needed" : "Surplus cushion"}
                value={formatCurrency(Math.abs(gap))}
                sub={gap > 0 ? "Above your current savings" : "You are already there"}
              />
              <MetricTile
                label="Goal progress"
                value={formatPercent((savings.value! / goal) * 100, 1)}
                sub="Current savings ÷ goal"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "Goal = (monthly expenses × 12) ÷ dividend yield" },
                {
                  title: "Substitute",
                  body: `(${formatCurrency(expenses.value!)} × 12) ÷ ${formatPercent(yieldPct.value!, 1)} = ${formatCurrency(expenses.value! * 12)} ÷ ${yieldPct.value! / 100}`,
                },
                { title: "Result", body: `Goal portfolio = ${formatCurrency(goal)}` },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your expenses and yield"
            description="The goal portfolio — the number that buys your freedom — appears here."
          />
        )}
      </div>
    </div>
  )
}
