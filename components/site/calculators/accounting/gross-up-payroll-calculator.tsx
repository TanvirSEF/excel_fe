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

const DEFAULTS = { net: "5000", tax: "30" }

export function GrossUpPayrollCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const net = parseNumericInput(values.net, { min: 0.01 })
  const tax = parseNumericInput(values.tax, { min: 0.01, max: 99 })

  const valid = net.value !== null && tax.value !== null
  const gross = valid ? net.value! / (1 - tax.value! / 100) : null
  const taxAmount = valid && gross !== null ? gross - net.value! : 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Take-home target</CardTitle>
          <CardDescription>
            Gross-up: what to pay so the employee nets exactly this after tax.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Desired take-home pay"
            value={values.net}
            onChange={(v) => update("net", v)}
            error={net.error}
            hint="What the employee should receive in hand"
            suffix="$"
            placeholder="5000"
          />
          <NumberField
            label="Total tax rate"
            value={values.tax}
            onChange={(v) => update("tax", v)}
            error={tax.error}
            hint="Combined federal + state + payroll taxes"
            suffix="%"
            placeholder="30"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && gross !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Gross pay needed"
              value={formatCurrency(gross)}
              sub={`So that ${formatCurrency(net.value!)} lands after ${formatPercent(tax.value!, 0)} tax`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Tax withheld" value={formatCurrency(taxAmount)} sub="Employer remits this" />
              <MetricTile label="Net to employee" value={formatCurrency(net.value!)} sub="Exactly the target" />
              <MetricTile
                label="Gross-up factor"
                value={`${(1 / (1 - tax.value! / 100)).toFixed(3)}x`}
                sub="Multiply any net by this"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "Gross = Net ÷ (1 − tax rate)" },
                {
                  title: "Substitute",
                  body: `${formatCurrency(net.value!)} ÷ (1 − ${tax.value! / 100})`,
                },
                { title: "Result", body: `Gross = ${formatCurrency(gross)}` },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Common for relocation packages, bonuses and promised net amounts — the
              employer covers the tax burden on top.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter take-home target and tax rate"
            description="The grossed-up pay appears here instantly."
          />
        )}
      </div>
    </div>
  )
}
