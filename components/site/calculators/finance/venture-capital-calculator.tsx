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

const DEFAULTS = { pre: "8000000", invest: "2000000", yours: "60" }

export function VentureCapitalCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const pre = parseNumericInput(values.pre, { min: 0.000001 })
  const invest = parseNumericInput(values.invest, { min: 0.000001 })
  const yours = parseNumericInput(values.yours, { min: 0, max: 100 })

  const valid = pre.value !== null && invest.value !== null && yours.value !== null

  const post = valid ? pre.value! + invest.value! : 0
  const investorPct = valid ? (invest.value! / post) * 100 : null
  const diluted = valid && investorPct !== null ? yours.value! * (1 - investorPct / 100) : null
  const stakeValue = valid && diluted !== null ? (diluted / 100) * post : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>The round</CardTitle>
          <CardDescription>
            How a new investment reshapes who owns what percentage of the company.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Pre-money valuation"
            value={values.pre}
            onChange={(v) => update("pre", v)}
            error={pre.error}
            hint="The company's agreed value before the new cash"
            suffix="$"
            placeholder="8000000"
          />
          <NumberField
            label="New investment"
            value={values.invest}
            onChange={(v) => update("invest", v)}
            error={invest.error}
            suffix="$"
            placeholder="2000000"
          />
          <NumberField
            label="Your current stake"
            value={values.yours}
            onChange={(v) => update("yours", v)}
            error={yours.error}
            hint="Founders + team + earlier investors all dilute the same way"
            suffix="%"
            placeholder="60"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && investorPct !== null && diluted !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Post-money valuation"
              value={formatCurrency(post)}
              sub={`Pre-money ${formatCurrency(pre.value!)} + ${formatCurrency(invest.value!)} new investment`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="New investor gets"
                value={formatPercent(investorPct, 1)}
                sub={`${formatCurrency(invest.value!)} ÷ ${formatCurrency(post)}`}
              />
              <MetricTile
                label="Your diluted stake"
                value={formatPercent(diluted, 1)}
                sub={`Was ${formatPercent(yours.value!, 0)} — diluted by ${formatPercent(yours.value! - diluted, 1)}`}
              />
              <MetricTile
                label="Your stake is worth"
                value={formatCurrency(stakeValue ?? 0, 0)}
                sub="Diluted % × post-money value"
              />
            </div>

            <StepList
              steps={[
                { title: "Post-money", body: "Post = pre-money + investment" },
                {
                  title: "Investor share",
                  body: `${formatCurrency(invest.value!)} ÷ ${formatCurrency(post)} = ${formatPercent(investorPct, 1)}`,
                },
                {
                  title: "Dilution",
                  body: `${formatPercent(yours.value!, 0)} × (1 − ${formatDecimal(investorPct / 100, 3)}) = ${formatPercent(diluted, 1)}`,
                },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Dilution is not loss — your smaller slice of a bigger pie is often worth
              more. Repeat for each round to model a full cap table.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter valuation, investment and your stake"
            description="Post-money value, investor share and your diluted stake appear here."
          />
        )}
      </div>
    </div>
  )
}
