"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseNumericInput } from "@/lib/calculators"
import { calculateFutureValue, calculatePresentValue } from "@/lib/calc-tvm"
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/format"

const DEFAULTS = {
  amount: "10000",
  rate: "8",
  years: "10",
}

/** Years for money to double at a nominal annual rate: ln(2) / ln(1+r). */
function doublingYears(annualRatePercent: number): number | null {
  if (annualRatePercent <= 0) return null
  return Math.log(2) / Math.log(1 + annualRatePercent / 100)
}

export function PvFvCalculator() {
  const [mode, setMode] = useState<"compound" | "discount">("compound")
  const [amount, setAmount] = useState(DEFAULTS.amount)
  const [rate, setRate] = useState(DEFAULTS.rate)
  const [years, setYears] = useState(DEFAULTS.years)

  const amountInput = parseNumericInput(amount, { min: 0.01 })
  const rateInput = parseNumericInput(rate, { min: 0, max: 100 })
  const yearsInput = parseNumericInput(years, { min: 1, max: 100, integer: true })

  const result =
    amountInput.value === null || rateInput.value === null || !yearsInput.value
      ? null
      : (mode === "compound" ? calculateFutureValue : calculatePresentValue)({
          amount: amountInput.value,
          annualRatePercent: rateInput.value,
          years: yearsInput.value,
        })

  const invalid =
    amountInput.error !== null ||
    rateInput.error !== null ||
    yearsInput.error !== null

  const doubling = rateInput.value === null ? null : doublingYears(rateInput.value)

  function reset() {
    setAmount(DEFAULTS.amount)
    setRate(DEFAULTS.rate)
    setYears(DEFAULTS.years)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Time value of money</CardTitle>
          <CardDescription>
            {mode === "compound"
              ? "Grow a lump sum forward with annual compounding."
              : "Discount a future amount back to what it is worth today."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(value) =>
              setMode(value === "discount" ? "discount" : "compound")
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="compound" className="flex-1">
                Compound (FV)
              </TabsTrigger>
              <TabsTrigger value="discount" className="flex-1">
                Discount (PV)
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <NumberField
            label={mode === "compound" ? "Present value" : "Future value"}
            value={amount}
            onChange={setAmount}
            error={amountInput.error}
            hint={
              mode === "compound"
                ? "The lump sum you have today"
                : "The amount you will receive later"
            }
            suffix="$"
            placeholder="10,000"
          />
          <NumberField
            label="Annual rate"
            value={rate}
            onChange={setRate}
            error={rateInput.error}
            hint="Nominal yearly rate — 0 is allowed"
            suffix="%"
            placeholder="8"
          />
          <NumberField
            label="Years"
            value={years}
            onChange={setYears}
            error={yearsInput.error}
            hint="Between 1 and 100 years"
            suffix="yrs"
            placeholder="10"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            className="w-full gap-1.5"
          >
            <IconRotate className="h-3.5 w-3.5" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-3">
        {result && !invalid ? (
          <div className="space-y-3 lg:sticky lg:top-24">
            <ResultsRegion>
              {mode === "compound" ? (
                <GradientHeroMetric
                  label="Future value"
                  value={formatCurrency(result.value)}
                  sub={`${formatCurrency(amountInput.value ?? 0)} at ${rateInput.value}% a year for ${yearsInput.value} years`}
                />
              ) : (
                <GradientHeroMetric
                  label="Present value"
                  value={formatCurrency(result.value)}
                  sub={`${formatCurrency(amountInput.value ?? 0)} in ${yearsInput.value} years, discounted at ${rateInput.value}%`}
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                <MetricTile
                  label={mode === "compound" ? "Growth factor" : "Discount factor"}
                  value={
                    mode === "compound"
                      ? formatMultiple(result.factor)
                      : formatPercent(result.factor * 100)
                  }
                  sub={
                    mode === "compound"
                      ? "(1 + r)^n — multiply by this to project forward"
                      : "1 ÷ (1 + r)^n — the share of face value you keep"
                  }
                />
                <MetricTile
                  label={mode === "compound" ? "Interest earned" : "Interest given up"}
                  value={formatCurrency(result.impliedInterest)}
                  sub={
                    mode === "compound"
                      ? "Growth on top of the starting amount"
                      : "The cost of waiting for the money"
                  }
                />
                <MetricTile
                  label="Effective annual rate"
                  value={formatPercent(result.effectiveAnnualRatePercent)}
                  sub="If the same nominal rate compounded monthly"
                />
                <MetricTile
                  label="Doubling time"
                  value={doubling === null ? "Never at 0%" : `${doubling.toFixed(1)} yrs`}
                  sub="ln(2) ÷ ln(1 + r) — the rule of 72, exact"
                />
              </div>
            </ResultsRegion>
          </div>
        ) : (
          <ResultsPlaceholder
            title={invalid ? "Fix the highlighted fields" : "Enter an amount"}
            description="Future or present value, the compounding factor and the implied interest appear here as soon as the inputs are valid."
          />
        )}
      </div>
    </div>
  )
}
