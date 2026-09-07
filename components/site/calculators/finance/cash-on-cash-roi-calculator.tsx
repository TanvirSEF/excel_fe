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
import { formatCurrency, formatDecimal, formatPercent } from "@/lib/format"

const DEFAULTS = { invested: "60000", cashFlow: "7200" }

export function CashOnCashRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const invested = parseNumericInput(values.invested, { min: 1 })
  const cashFlow = parseNumericInput(values.cashFlow, { min: 0 })

  const valid = invested.value !== null && cashFlow.value !== null

  const coc = valid ? (cashFlow.value! / invested.value!) * 100 : null
  const paybackYears = valid && cashFlow.value! > 0 ? invested.value! / cashFlow.value! : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Cash in, cash out</CardTitle>
          <CardDescription>
            Only the cash you actually put in — down payment, closing costs, repairs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Cash invested"
            value={values.invested}
            onChange={(v) => update("invested", v)}
            error={invested.error}
            hint="Down payment + closing costs + rehab"
            suffix="$"
            placeholder="60000"
          />
          <NumberField
            label="Annual pre-tax cash flow"
            value={values.cashFlow}
            onChange={(v) => update("cashFlow", v)}
            error={cashFlow.error}
            hint="Rent minus mortgage, taxes, insurance & repairs"
            suffix="$"
            placeholder="7200"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && coc !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Cash on cash ROI"
              value={formatPercent(coc)}
              sub={`Annual cash flow ÷ cash invested — how hard your down payment works`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Monthly cash flow"
                value={formatCurrency(cashFlow.value! / 12)}
                sub="What hits your pocket each month"
              />
              <MetricTile
                label="Payback"
                value={paybackYears !== null ? `${formatDecimal(paybackYears, 1)} yr` : "—"}
                sub="Years of cash flow to return your cash"
              />
              <MetricTile
                label="5-year cash flow"
                value={formatCurrency(cashFlow.value! * 5, 0)}
                sub="If nothing changes"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "CoC = annual pre-tax cash flow ÷ cash invested" },
                {
                  title: "Substitute",
                  body: `${formatCurrency(cashFlow.value!, 0)} ÷ ${formatCurrency(invested.value!, 0)}`,
                },
                { title: "Result", body: `CoC = ${formatPercent(coc)}` },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Investors typically want 8%+ cash on cash. Unlike the cap rate, this metric
              accounts for financing — leverage can push it far above the property&apos;s cap rate.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter cash invested and annual cash flow"
            description="Cash on cash ROI, monthly flow and payback appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
