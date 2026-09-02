"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { CopyTableButton } from "@/components/site/calculators/copy-table-button"
import { NumberField } from "@/components/site/calculators/field"
import { ProjectionChart } from "@/components/site/calculators/projection-chart"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { parseNumericInput } from "@/lib/calculators"
import { calculateCompoundInterest } from "@/lib/calc-compound"
import {
  formatCurrency,
  formatMultiple,
  formatPercent,
} from "@/lib/format"

const DEFAULTS = {
  principal: "10000",
  monthlyContribution: "500",
  rate: "8",
  years: "10",
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(DEFAULTS.principal)
  const [monthlyContribution, setMonthlyContribution] = useState(
    DEFAULTS.monthlyContribution
  )
  const [rate, setRate] = useState(DEFAULTS.rate)
  const [years, setYears] = useState(DEFAULTS.years)

  const principalInput = parseNumericInput(principal, { min: 0 })
  const contributionInput = parseNumericInput(monthlyContribution, { min: 0 })
  const rateInput = parseNumericInput(rate, { min: 0, max: 100 })
  const yearsInput = parseNumericInput(years, { min: 1, max: 100, integer: true })

  const result =
    principalInput.value === null ||
    contributionInput.value === null ||
    rateInput.value === null ||
    !yearsInput.value ||
    (principalInput.value === 0 && contributionInput.value === 0)
      ? null
      : calculateCompoundInterest({
          principal: principalInput.value,
          monthlyContribution: contributionInput.value,
          annualRatePercent: rateInput.value,
          years: yearsInput.value,
        })

  const invalid =
    principalInput.error !== null ||
    contributionInput.error !== null ||
    rateInput.error !== null ||
    yearsInput.error !== null

  const copyRows = result
    ? [
        ["Year", "Value", "Contributions", "Interest"],
        ...result.yearly.map((row) => [
          String(row.year),
          row.value.toFixed(2),
          row.contributions.toFixed(2),
          row.interest.toFixed(2),
        ]),
      ]
    : []

  function reset() {
    setPrincipal(DEFAULTS.principal)
    setMonthlyContribution(DEFAULTS.monthlyContribution)
    setRate(DEFAULTS.rate)
    setYears(DEFAULTS.years)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Savings plan</CardTitle>
            <CardDescription>
              Monthly compounding with deposits at the end of each month —
              Excel&apos;s FV default.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberField
              label="Initial deposit"
              value={principal}
              onChange={setPrincipal}
              error={principalInput.error}
              hint="Lump sum you start with"
              suffix="$"
              placeholder="10,000"
            />
            <NumberField
              label="Monthly contribution"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              error={contributionInput.error}
              hint="Added at the end of every month"
              suffix="$"
              placeholder="500"
            />
            <NumberField
              label="Annual interest rate"
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
                <GradientHeroMetric
                  label="Future value"
                  value={formatCurrency(result.futureValue)}
                  sub={`After ${yearsInput.value} years of monthly compounding`}
                />
                <div className="grid grid-cols-2 gap-3">
                  <MetricTile
                    label="Total interest earned"
                    value={formatCurrency(result.totalInterest)}
                    sub="Growth on top of your deposits"
                  />
                  <MetricTile
                    label="Total contributed"
                    value={formatCurrency(result.totalContributions)}
                    sub="Initial deposit plus monthly savings"
                  />
                  <MetricTile
                    label="Growth multiple"
                    value={formatMultiple(result.multiple)}
                    sub="Final value ÷ money put in"
                  />
                  <MetricTile
                    label="Interest share"
                    value={formatPercent(
                      (result.totalInterest / result.futureValue) * 100,
                      1
                    )}
                    sub="Share of the final balance"
                  />
                </div>
              </ResultsRegion>
            </div>
          ) : (
            <ResultsPlaceholder
              title={
                invalid
                  ? "Fix the highlighted fields"
                  : "Enter deposit or contribution"
              }
              description="Future value, interest earned and a yearly growth breakdown appear here as soon as the plan is valid."
            />
          )}
        </div>
      </div>

      {result ? (
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>Year-by-year growth</CardTitle>
              <CardDescription>
                Balance, cumulative deposits and earned interest at the end of
                each year.
              </CardDescription>
            </div>
            <CopyTableButton rows={copyRows} />
          </CardHeader>
          <CardContent className="space-y-6">
            <ProjectionChart
              projection={result.yearly.map((row) => ({
                year: row.year,
                value: row.value,
                growthFromStart:
                  ((row.value - row.contributions) /
                    Math.max(row.contributions, 1)) *
                  100,
              }))}
            />

            <div className="max-h-96 overflow-auto rounded-xl border border-border/70">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted">
                  <TableRow>
                    <TableHead className="text-right">Year</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Contributions</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.yearly.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {row.year}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums font-medium">
                        {formatCurrency(row.value)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                        {formatCurrency(row.contributions)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {formatCurrency(row.interest)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
