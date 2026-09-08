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
  net: "1000",
  federal: "22.0",
  state: "5.0",
  local: "0.0",
  socialSecurity: "6.2",
  medicare: "1.45",
}

export function GrossUpPayrollCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const net = parseNumericInput(values.net, { min: 0.000001 })
  const federal = parseNumericInput(values.federal, { min: 0, max: 100 })
  const state = parseNumericInput(values.state, { min: 0, max: 100 })
  const local = parseNumericInput(values.local, { min: 0, max: 100 })
  const socialSecurity = parseNumericInput(values.socialSecurity, { min: 0, max: 100 })
  const medicare = parseNumericInput(values.medicare, { min: 0, max: 100 })

  const valid = [net, federal, state, local, socialSecurity, medicare].every(
    (field) => field.value !== null
  )

  const totalTaxRate = valid
    ? (federal.value! + state.value! + local.value! + socialSecurity.value! + medicare.value!) / 100
    : 0
  const grossPay = valid && totalTaxRate < 1 ? net.value! / (1 - totalTaxRate) : 0
  const totalWithheld = valid ? grossPay - net.value! : 0
  const federalAmount = valid ? grossPay * (federal.value! / 100) : 0
  const ficaAmount = valid
    ? grossPay * ((socialSecurity.value! + medicare.value!) / 100)
    : 0
  const markupPercent = valid && net.value! > 0 ? (totalWithheld / net.value!) * 100 : 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter desired take-home pay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Target net pay ($)" value={values.net} onChange={(v) => update("net", v)} error={net.error} hint="The exact amount the employee receives." suffix="$" placeholder="1000" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tax assumptions (%)
          </p>
          <NumberField label="Federal tax" value={values.federal} onChange={(v) => update("federal", v)} error={federal.error} suffix="%" placeholder="22.0" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="State tax" value={values.state} onChange={(v) => update("state", v)} error={state.error} suffix="%" placeholder="5.0" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Local tax" value={values.local} onChange={(v) => update("local", v)} error={local.error} suffix="%" placeholder="0.0" />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Social Security" value={values.socialSecurity} onChange={(v) => update("socialSecurity", v)} error={socialSecurity.error} hint="*Default FICA rates" suffix="%" placeholder="6.2" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Medicare tax" value={values.medicare} onChange={(v) => update("medicare", v)} error={medicare.error} suffix="%" placeholder="1.45" />
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && totalTaxRate < 1 ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Required gross pay"
              value={formatCurrency(grossPay)}
            />

            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
              <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Calculation Success: You need to add {formatPercent(markupPercent, 1)} to
                cover taxes.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Total taxes withheld" value={formatCurrency(totalWithheld)} sub="Gross − net pay" />
              <MetricTile label="Effective tax rate" value={formatPercent(totalTaxRate * 100, 2)} sub="All rates combined" />
              <MetricTile label="Federal tax" value={formatCurrency(federalAmount)} sub={`${federal.value}% of gross`} />
              <MetricTile label="FICA (SS + Med)" value={formatCurrency(ficaAmount)} sub="Social Security + Medicare" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your target net pay"
            description="The required gross pay and tax breakdown appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
