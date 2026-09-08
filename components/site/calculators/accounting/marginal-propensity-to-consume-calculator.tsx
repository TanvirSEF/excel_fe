"use client"

import { useState } from "react"
import { IconInfoCircle, IconRotate } from "@tabler/icons-react"

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
import { formatDecimal } from "@/lib/format"

const DEFAULTS = { incomeChange: "1000", spendChange: "800" }

export function MarginalPropensityToConsumeCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const incomeChange = parseNumericInput(values.incomeChange, { min: 0.000001 })
  const spendChange = parseNumericInput(values.spendChange, { min: 0 })

  const valid = incomeChange.value !== null && spendChange.value !== null

  const mpc = valid ? spendChange.value! / incomeChange.value! : null
  const mps = mpc !== null ? 1 - mpc : null
  const multiplier = mpc !== null && mpc < 1 ? 1 / (1 - mpc) : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter income &amp; spending data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Change in income ($)" value={values.incomeChange} onChange={(v) => update("incomeChange", v)} error={incomeChange.error} hint="Additional earnings (ΔY)" suffix="$" placeholder="1000" />
          <NumberField label="Change in spending ($)" value={values.spendChange} onChange={(v) => update("spendChange", v)} error={spendChange.error} hint="Amount spent from income (ΔC)" suffix="$" placeholder="800" />

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && mpc !== null && mps !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Marginal propensity to consume"
              value={formatDecimal(mpc, 2)}
            />

            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
              <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                {mpc > 0.8
                  ? "Spender: High spending habits."
                  : mpc >= 0.5
                    ? "Balanced: Moderate spending habits."
                    : "Saver: Strong saving habits."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Propensity to save" value={formatDecimal(mps, 2)} sub="1 − MPC" />
              <MetricTile
                label="Multiplier effect"
                value={multiplier !== null ? `${formatDecimal(multiplier, 2)}x` : "—"}
                sub="1 ÷ (1 − MPC)"
              />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your income and spending change"
            description="Your MPC, saving propensity and multiplier appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
