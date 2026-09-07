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
import { formatCurrency, formatDecimal } from "@/lib/format"

const DEFAULTS = { incomeChange: "1000", spendChange: "850" }

export function MarginalPropensityToConsumeCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const incomeChange = parseNumericInput(values.incomeChange, { min: 0.01 })
  const spendChange = parseNumericInput(values.spendChange, { min: 0 })

  const valid = incomeChange.value !== null && spendChange.value !== null
  const tooMuch = valid && spendChange.value! > incomeChange.value!

  const mpc = valid && !tooMuch ? spendChange.value! / incomeChange.value! : null
  const mps = mpc !== null ? 1 - mpc : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>The raise</CardTitle>
          <CardDescription>
            How much extra money came in, and how much of it you actually spent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Change in income"
            value={values.incomeChange}
            onChange={(v) => update("incomeChange", v)}
            error={incomeChange.error}
            hint="The raise, bonus or extra earnings"
            suffix="$"
            placeholder="1000"
          />
          <NumberField
            label="Change in spending"
            value={values.spendChange}
            onChange={(v) => update("spendChange", v)}
            error={spendChange.error}
            hint="How much of it you spent"
            suffix="$"
            placeholder="850"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && mpc !== null && mps !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Marginal propensity to consume"
              value={formatDecimal(mpc, 3)}
              sub={`You spend ${formatDecimal(mpc * 100, 1)}¢ of every extra dollar you earn`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Marginal propensity to save"
                value={formatDecimal(mps, 3)}
                sub="The share you keep"
              />
              <MetricTile
                label="Extra spent"
                value={formatCurrency(spendChange.value!)}
                sub="Of the raise"
              />
              <MetricTile
                label="Extra saved"
                value={formatCurrency(incomeChange.value! - spendChange.value!)}
                sub="What you did not spend"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "MPC = ΔConsumption ÷ ΔIncome" },
                {
                  title: "Substitute",
                  body: `${formatCurrency(spendChange.value!)} ÷ ${formatCurrency(incomeChange.value!)}`,
                },
                {
                  title: "Result",
                  body: `MPC = ${formatDecimal(mpc, 3)} · MPS = 1 − MPC = ${formatDecimal(mps, 3)}`,
                },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Economists use MPC to predict how tax cuts and stimulus ripple through the
              economy — an MPC near 1 means every extra dollar gets spent, near 0 means
              it all gets saved.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title={tooMuch ? "Spending exceeds the income change" : "Enter the income and spending change"}
            description={
              tooMuch
                ? "MPC is defined between 0 and 1 — you cannot spend more of a raise than the raise itself."
                : "Your MPC and MPS appear here instantly."
            }
          />
        )}
      </div>
    </div>
  )
}
