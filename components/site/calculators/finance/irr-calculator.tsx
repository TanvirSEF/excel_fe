"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { DataSetField } from "@/components/site/calculators/statistics/data-set-field"
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
import { formatCurrency, formatPercent } from "@/lib/format"
import { parseDataSet } from "@/lib/stats"
import { irr, npv } from "@/lib/finance"

const DEFAULT_FLOWS = "-1000, 400, 400, 400"

export function IrrCalculator() {
  const [raw, setRaw] = useState(DEFAULT_FLOWS)

  const { values, invalid } = parseDataSet(raw)
  const flows = values
  const needsNegativeFirst = flows.length >= 2 && flows[0] >= 0
  const needsPositive = flows.length >= 2 && !flows.some((cf) => cf > 0)
  const result = !needsNegativeFirst && !needsPositive ? irr(flows) : null
  const npvCheck = result !== null ? npv(result, flows) : null
  const totalProfit = flows.reduce((total, cf) => total + cf, 0)
  const valid = result !== null && invalid.length === 0 && flows.length >= 2

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Cash flows</CardTitle>
          <CardDescription>
            Year 0 first (the investment, negative), then each year&apos;s cash flow —
            commas, spaces or new lines.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataSetField
            label="Cash flow series"
            value={raw}
            onChange={setRaw}
            placeholder="e.g. -1000, 400, 400, 400"
            invalid={needsNegativeFirst || needsPositive}
          />
          {needsNegativeFirst ? (
            <p className="text-[11px] leading-snug text-destructive">
              The first value is the initial investment — enter it as a negative number.
            </p>
          ) : null}
          {needsPositive ? (
            <p className="text-[11px] leading-snug text-destructive">
              Add at least one positive cash flow — an investment that never pays back has
              no IRR.
            </p>
          ) : null}
          <Button type="button" variant="outline" className="w-full" onClick={() => setRaw(DEFAULT_FLOWS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && result !== null && npvCheck !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Internal rate of return"
              value={formatPercent(result * 100, 2)}
              sub="The discount rate that makes the NPV of these cash flows exactly zero"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="NPV check"
                value={formatCurrency(npvCheck)}
                sub="≈ $0 confirms the solution"
              />
              <MetricTile
                label="Total profit"
                value={formatCurrency(totalProfit, 0)}
                sub="Sum of all cash flows"
              />
              <MetricTile
                label="Periods"
                value={`${flows.length - 1}`}
                sub="Years after the initial investment"
              />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              IRR of {formatPercent(result * 100, 2)} means the investment compounds your
              money at that rate every year. Compare it directly with any other
              investment&apos;s return — that is what makes it the gold standard.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter a cash flow series"
            description="Start with the negative initial investment, then each year's returns — the IRR appears instantly."
          />
        )}
      </div>
    </div>
  )
}
