"use client"

import { useState } from "react"
import { IconCircleCheck, IconRotate } from "@tabler/icons-react"

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
import { formatCurrency, formatDecimal } from "@/lib/format"

const DEFAULTS = {
  currentAge: "30",
  retireAge: "60",
  savings: "50000",
  contribution: "1000",
  annualIncrease: "5",
  expectedReturn: "8",
  inflation: "3",
}

export function RetirementRateOfReturnCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const currentAge = parseNumericInput(values.currentAge, { min: 0, max: 100, integer: true })
  const retireAge = parseNumericInput(values.retireAge, { min: 1, max: 100, integer: true })
  const savings = parseNumericInput(values.savings, { min: 0 })
  const contribution = parseNumericInput(values.contribution, { min: 0 })
  const annualIncrease = parseNumericInput(values.annualIncrease, { min: 0, max: 100 })
  const expectedReturn = parseNumericInput(values.expectedReturn, { min: 0, max: 50 })
  const inflation = parseNumericInput(values.inflation, { min: 0, max: 30 })

  const valid =
    [currentAge, retireAge, savings, contribution, annualIncrease, expectedReturn, inflation].every(
      (field) => field.value !== null
    ) && retireAge.value! > currentAge.value!

  let corpus = 0
  let totalContributed = 0
  let purchasingPower = 0
  let monthlyIncome = 0

  if (valid) {
    const years = retireAge.value! - currentAge.value!
    const monthlyRate = expectedReturn.value! / 100 / 12
    let balance = savings.value!
    let monthlyContribution = contribution.value!
    totalContributed = savings.value!

    for (let month = 1; month <= years * 12; month++) {
      balance = (balance + monthlyContribution) * (1 + monthlyRate)
      totalContributed += monthlyContribution
      if (month % 12 === 0) monthlyContribution *= 1 + annualIncrease.value! / 100
    }

    corpus = balance
    purchasingPower = corpus / (1 + inflation.value! / 100) ** years
    monthlyIncome = (corpus * 0.04) / 12
  }

  const millionaire = valid && corpus >= 1_000_000

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter retirement goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Timeline &amp; status
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Current age" value={values.currentAge} onChange={(v) => update("currentAge", v)} error={currentAge.error} placeholder="30" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Target retire age" value={values.retireAge} onChange={(v) => update("retireAge", v)} error={retireAge.error} placeholder="60" />
            </div>
          </div>
          <NumberField label="Current savings ($)" value={values.savings} onChange={(v) => update("savings", v)} error={savings.error} suffix="$" placeholder="50000" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Contributions &amp; growth
          </p>
          <NumberField label="Monthly contribution ($)" value={values.contribution} onChange={(v) => update("contribution", v)} error={contribution.error} suffix="$" placeholder="1000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Annual increase (%)" value={values.annualIncrease} onChange={(v) => update("annualIncrease", v)} error={annualIncrease.error} suffix="%" placeholder="5" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Expected return (%)" value={values.expectedReturn} onChange={(v) => update("expectedReturn", v)} error={expectedReturn.error} suffix="%" placeholder="8" />
            </div>
          </div>
          <NumberField label="Inflation rate (%)" value={values.inflation} onChange={(v) => update("inflation", v)} error={inflation.error} suffix="%" placeholder="3" />

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
              label="Projected retirement corpus"
              value={formatCurrency(corpus, 0)}
              sub={`Purchasing power: ${formatCurrency(purchasingPower, 0)}`}
            />

            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
              <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                {millionaire
                  ? "Millionaire Status: On track for wealth."
                  : "Building Phase: Keep contributing consistently."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Total contributed" value={formatCurrency(totalContributed, 0)} sub="Savings + all contributions" />
              <MetricTile label="Investment profit" value={formatCurrency(corpus - totalContributed, 0)} sub="Growth on your money" />
              <MetricTile label="Monthly dist (4%)" value={`${formatCurrency(monthlyIncome, 0)}/mo`} sub="Safe withdrawal estimate" />
              <MetricTile label="Wealth multiplier" value={`${formatDecimal(totalContributed > 0 ? corpus / totalContributed : 0, 2)}x`} sub="Corpus ÷ contributed" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your retirement goals"
            description="Projected corpus, purchasing power and monthly income appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
