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
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = {
  investment: "500000",
  multiple: "10",
  exitValue: "50000000",
  yearsToExit: "7",
  dilution: "20",
}

function irrVerdict(irr: number): {
  kind: "high" | "moderate" | "low"
  text: string
} {
  if (irr >= 30) return { kind: "high", text: "High Growth Profile: Strong yield potential." }
  if (irr >= 15)
    return { kind: "moderate", text: "Moderate Profile: Typical return potential." }
  return { kind: "low", text: "Low Profile: Weak return potential." }
}

export function VentureCapitalCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const investment = parseNumericInput(values.investment, { min: 0.000001 })
  const multiple = parseNumericInput(values.multiple, { min: 0.000001 })
  const exitValue = parseNumericInput(values.exitValue, { min: 0.000001 })
  const yearsToExit = parseNumericInput(values.yearsToExit, { min: 0.000001 })
  const dilution = parseNumericInput(values.dilution, { min: 0, max: 99.99 })

  const valid = [investment, multiple, exitValue, yearsToExit, dilution].every(
    (field) => field.value !== null
  )

  const targetProceeds = valid ? investment.value! * multiple.value! : 0
  const ownershipAtExit = valid ? targetProceeds / exitValue.value! : 0
  const requiredOwnership = valid ? ownershipAtExit / (1 - dilution.value! / 100) : 0
  const postMoney = valid && requiredOwnership > 0 ? investment.value! / requiredOwnership : 0
  const preMoney = valid ? postMoney - investment.value! : 0
  const impliedIrr = valid && multiple.value! > 0 ? multiple.value! ** (1 / yearsToExit.value!) - 1 : 0
  const irrPercent = impliedIrr * 100
  const verdict = valid ? irrVerdict(irrPercent) : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter investment terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Investment &amp; target multiple
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Investment ($)" value={values.investment} onChange={(v) => update("investment", v)} error={investment.error} suffix="$" placeholder="500000" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Target multiple (x)" value={values.multiple} onChange={(v) => update("multiple", v)} error={multiple.error} suffix="x" placeholder="10" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Exit scenario &amp; dilution
          </p>
          <NumberField label="Estimated exit value ($)" value={values.exitValue} onChange={(v) => update("exitValue", v)} error={exitValue.error} suffix="$" placeholder="50000000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Time to exit (years)" value={values.yearsToExit} onChange={(v) => update("yearsToExit", v)} error={yearsToExit.error} suffix="yr" placeholder="7" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Future dilution (%)" value={values.dilution} onChange={(v) => update("dilution", v)} error={dilution.error} suffix="%" placeholder="20" />
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && verdict ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Max post-money valuation"
              value={formatCurrency(postMoney, 0)}
            />

            {verdict.kind === "low" ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{verdict.text}</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                {verdict.kind === "moderate" ? (
                  <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <p>{verdict.text}</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Pre-money valuation" value={formatCurrency(preMoney, 0)} sub="Post-money − investment" />
              <MetricTile label="Required ownership" value={formatPercent(requiredOwnership * 100, 2)} sub="Dilution-adjusted stake today" />
              <MetricTile label="Venture proceeds" value={formatCurrency(targetProceeds, 0)} sub={`Investment × ${multiple.value}x target`} />
              <MetricTile label="Implied return yield" value={formatPercent(irrPercent, 1)} sub={`IRR over ${yearsToExit.value} years`} />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your investment terms"
            description="Post-money valuation, required ownership and implied IRR appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
