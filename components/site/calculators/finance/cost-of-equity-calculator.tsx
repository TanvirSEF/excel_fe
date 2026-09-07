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
import { formatDecimal, formatPercent } from "@/lib/format"

const DEFAULTS = { rf: "4.2", beta: "1.35", market: "9.7" }

export function CostOfEquityCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const rf = parseNumericInput(values.rf, { min: 0, max: 100 })
  const beta = parseNumericInput(values.beta, { min: 0 })
  const market = parseNumericInput(values.market, { min: 0, max: 100 })

  const valid = rf.value !== null && beta.value !== null && market.value !== null

  const premium = valid ? market.value! - rf.value! : null
  const ke = valid && premium !== null ? rf.value! + beta.value! * premium : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>CAPM inputs</CardTitle>
          <CardDescription>
            The Capital Asset Pricing Model — the return investors demand for the risk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Risk-free rate (rf)"
            value={values.rf}
            onChange={(v) => update("rf", v)}
            error={rf.error}
            hint="Usually the 10-year Treasury yield"
            suffix="%"
            placeholder="4.2"
          />
          <NumberField
            label="Beta (β)"
            value={values.beta}
            onChange={(v) => update("beta", v)}
            error={beta.error}
            hint="1 = moves with the market · over 1 = more volatile"
            placeholder="1.35"
          />
          <NumberField
            label="Expected market return (rm)"
            value={values.market}
            onChange={(v) => update("market", v)}
            error={market.error}
            hint="Long-term stock market returns run 8–10%"
            suffix="%"
            placeholder="9.7"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && ke !== null && premium !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Cost of equity (Ke)"
              value={formatPercent(ke, 3)}
              sub="The minimum return this stock must deliver to be worth its risk"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Risk-free rate" value={formatPercent(rf.value!, 2)} sub="The baseline, no-risk return" />
              <MetricTile
                label="Market risk premium"
                value={formatPercent(premium, 2)}
                sub="rm − rf = extra pay for market risk"
              />
              <MetricTile
                label="Beta-adjusted premium"
                value={formatPercent(beta.value! * premium, 2)}
                sub={`β ${formatDecimal(beta.value!, 2)} × premium`}
              />
            </div>

            <StepList
              steps={[
                { title: "CAPM formula", body: "Ke = rf + β × (rm − rf)" },
                {
                  title: "Substitute",
                  body: `${formatDecimal(rf.value!, 2)} + ${formatDecimal(beta.value!, 2)} × (${formatDecimal(market.value!, 2)} − ${formatDecimal(rf.value!, 2)})`,
                },
                { title: "Result", body: `Ke = ${formatPercent(ke, 3)}` },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              A cost of equity under {formatPercent(ke, 0)} this low suits conservative
              portfolios; anything expecting less than this return destroys value for
              shareholders.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter the three CAPM inputs"
            description="Risk-free rate, beta and market return — the cost of equity appears instantly."
          />
        )}
      </div>
    </div>
  )
}
