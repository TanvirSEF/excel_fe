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
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = {
  downPayment: "50000",
  closing: "5000",
  repairs: "10000",
  rent: "2500",
  financing: "1200",
  other: "300",
}

function cocVerdict(coc: number): { kind: "low" | "moderate" | "high"; text: string } {
  if (coc < 8) return { kind: "low", text: "Low Performance: Below the typical 8-12% target." }
  if (coc <= 12)
    return { kind: "moderate", text: "Solid Performance: Within the standard 8-12% range." }
  return { kind: "high", text: "High Performance: Excellent return." }
}

export function CashOnCashRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const downPayment = parseNumericInput(values.downPayment, { min: 0 })
  const closing = parseNumericInput(values.closing, { min: 0 })
  const repairs = parseNumericInput(values.repairs, { min: 0 })
  const rent = parseNumericInput(values.rent, { min: 0 })
  const financing = parseNumericInput(values.financing, { min: 0 })
  const other = parseNumericInput(values.other, { min: 0 })

  const valid = [downPayment, closing, repairs, rent, financing, other].every(
    (field) => field.value !== null
  )

  const totalCashInvested = valid
    ? downPayment.value! + closing.value! + repairs.value!
    : 0
  const monthlyCashFlow = valid
    ? rent.value! - financing.value! - other.value!
    : 0
  const annualCashFlow = valid ? monthlyCashFlow * 12 : 0
  const coc = valid && totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : null
  const verdict = coc !== null ? cocVerdict(coc) : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter investment data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Initial cash investment
          </p>
          <NumberField label="Down payment ($)" value={values.downPayment} onChange={(v) => update("downPayment", v)} error={downPayment.error} suffix="$" placeholder="50000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Closing costs ($)" value={values.closing} onChange={(v) => update("closing", v)} error={closing.error} suffix="$" placeholder="5000" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Repairs and rehabilitation ($)" value={values.repairs} onChange={(v) => update("repairs", v)} error={repairs.error} suffix="$" placeholder="10000" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Monthly operations
          </p>
          <NumberField label="Gross rent ($)" value={values.rent} onChange={(v) => update("rent", v)} error={rent.error} suffix="$" placeholder="2500" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Financing payment ($)" value={values.financing} onChange={(v) => update("financing", v)} error={financing.error} suffix="$" placeholder="1200" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Other expenses ($)" value={values.other} onChange={(v) => update("other", v)} error={other.error} suffix="$" placeholder="300" />
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && coc !== null && verdict ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Annual cash-on-cash return"
              value={formatPercent(coc, 2)}
              sub={`${formatCurrency(annualCashFlow, 0)}/yr`}
            />

            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
              <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{verdict.text}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Total cash invested" value={formatCurrency(totalCashInvested, 0)} sub="Down + closing + repairs" />
              <MetricTile label="Monthly cash flow" value={formatCurrency(monthlyCashFlow, 0)} sub="Rent − financing − other" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your investment data"
            description="Your cash-on-cash return and monthly cash flow appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
