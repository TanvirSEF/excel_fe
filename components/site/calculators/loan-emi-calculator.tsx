"use client"

import { useMemo, useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { AmortizationChart } from "@/components/site/calculators/amortization-chart"
import { CopyTableButton } from "@/components/site/calculators/copy-table-button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseNumericInput } from "@/lib/calculators"
import { calculateLoan } from "@/lib/calc-loan"
import {
  formatCurrency,
  formatMonths,
  formatPercent,
} from "@/lib/format"

const DEFAULTS = {
  amount: "500000",
  rate: "10",
  tenure: "5",
  tenureUnit: "years" as "years" | "months",
}

export function LoanEmiCalculator() {
  const [amount, setAmount] = useState(DEFAULTS.amount)
  const [rate, setRate] = useState(DEFAULTS.rate)
  const [tenure, setTenure] = useState(DEFAULTS.tenure)
  const [tenureUnit, setTenureUnit] = useState(DEFAULTS.tenureUnit)
  const [scheduleView, setScheduleView] = useState<"yearly" | "monthly">("yearly")

  const amountInput = useMemo(
    () => parseNumericInput(amount, { min: 1 }),
    [amount]
  )
  const rateInput = useMemo(
    () => parseNumericInput(rate, { min: 0, max: 100 }),
    [rate]
  )
  const tenureInput = useMemo(
    () =>
      parseNumericInput(tenure, {
        min: 1,
        max: tenureUnit === "years" ? 50 : 600,
        integer: true,
      }),
    [tenure, tenureUnit]
  )

  const result = useMemo(() => {
    if (!amountInput.value || rateInput.value === null || !tenureInput.value) {
      return null
    }
    const months =
      tenureUnit === "years" ? tenureInput.value * 12 : tenureInput.value
    if (months < 1) return null
    return calculateLoan({
      principal: amountInput.value,
      annualRatePercent: rateInput.value,
      months,
    })
  }, [amountInput, rateInput, tenureInput, tenureUnit])

  const invalid =
    Boolean(amountInput.error) ||
    Boolean(rateInput.error) ||
    Boolean(tenureInput.error)

  const scheduleRows = useMemo(() => {
    if (!result) return []
    return scheduleView === "yearly"
      ? result.yearly.map((row) => ({
          period: row.year,
          payment: row.payment,
          interest: row.interest,
          principal: row.principal,
          balance: row.balance,
        }))
      : result.schedule.map((row) => ({
          period: row.month,
          payment: row.payment,
          interest: row.interest,
          principal: row.principal,
          balance: row.balance,
        }))
  }, [result, scheduleView])

  const copyRows = useMemo(() => {
    if (!result) return []
    const header =
      scheduleView === "yearly"
        ? ["Year", "Payment", "Interest", "Principal", "Balance"]
        : ["Month", "Payment", "Interest", "Principal", "Balance"]
    const rows = scheduleRows.map((row) => [
      String(row.period),
      row.payment.toFixed(2),
      row.interest.toFixed(2),
      row.principal.toFixed(2),
      row.balance.toFixed(2),
    ])
    return [header, ...rows]
  }, [result, scheduleRows, scheduleView])

  function reset() {
    setAmount(DEFAULTS.amount)
    setRate(DEFAULTS.rate)
    setTenure(DEFAULTS.tenure)
    setTenureUnit(DEFAULTS.tenureUnit)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Inputs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Loan details</CardTitle>
            <CardDescription>
              Results update as you type — press Reset to restore the example
              loan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberField
              label="Loan amount"
              value={amount}
              onChange={setAmount}
              error={amountInput.error}
              hint="Total principal you are borrowing"
              suffix="$"
              placeholder="500,000"
            />
            <NumberField
              label="Annual interest rate"
              value={rate}
              onChange={setRate}
              error={rateInput.error}
              hint="Nominal yearly rate — 0 is allowed"
              suffix="%"
              placeholder="10"
            />
            <div className="space-y-1.5">
              <NumberField
                label="Loan tenure"
                value={tenure}
                onChange={setTenure}
                error={tenureInput.error}
                hint={
                  tenureUnit === "years"
                    ? "Between 1 and 50 years"
                    : "Between 1 and 600 months"
                }
                suffix={tenureUnit === "years" ? "yrs" : "mos"}
                placeholder="5"
              />
              <Select
                value={tenureUnit}
                onValueChange={(value) =>
                  setTenureUnit(value === "months" ? "months" : "years")
                }
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="years">Years</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

        {/* Results */}
        <div className="lg:col-span-3">
          {result && !invalid ? (
            <div className="space-y-3 lg:sticky lg:top-24">
              <ResultsRegion>
                <GradientHeroMetric
                  label="Monthly payment (EMI)"
                  value={formatCurrency(result.monthlyPayment)}
                  sub={`Payoff in ${formatMonths(result.totalMonths)} · ${result.totalMonths} payments`}
                />
                <div className="grid grid-cols-2 gap-3">
                  <MetricTile
                    label="Total interest"
                    value={formatCurrency(result.totalInterest)}
                    sub={`${formatPercent(
                      result.totalInterest / result.totalPayment,
                      1
                    )} of money paid`}
                  />
                  <MetricTile
                    label="Total payment"
                    value={formatCurrency(result.totalPayment)}
                    sub="Principal + interest"
                  />
                  <MetricTile
                    label="First-month interest"
                    value={formatCurrency(result.schedule[0].interest)}
                    sub={`Rate / 12 on ${formatCurrency(
                      amountInput.value ?? 0,
                      0
                    )}`}
                  />
                  <MetricTile
                    label="First-month principal"
                    value={formatCurrency(result.schedule[0].principal)}
                    sub="Payment minus interest"
                  />
                </div>
              </ResultsRegion>
            </div>
          ) : (
            <ResultsPlaceholder
              title={invalid ? "Fix the highlighted fields" : "Enter loan details"}
              description="Monthly payment, total interest and the full amortization schedule appear here as soon as the inputs are valid."
            />
          )}
        </div>
      </div>

      {result ? (
        <>
          <AmortizationChart schedule={result.schedule} />

          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4">
              <div className="space-y-1.5">
                <CardTitle>Amortization schedule</CardTitle>
                <CardDescription>
                  How each payment splits between interest and principal over
                  the life of the loan.
                </CardDescription>
              </div>
              <CopyTableButton rows={copyRows} />
            </CardHeader>
            <CardContent>
              <Tabs
                value={scheduleView}
                onValueChange={(value) =>
                  setScheduleView(value === "monthly" ? "monthly" : "yearly")
                }
              >
                <TabsList>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="mt-4 max-h-96 overflow-auto rounded-xl border border-border/70">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                      <TableHead className="text-right">
                        {scheduleView === "yearly" ? "Year" : "Month"}
                      </TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduleRows.map((row) => (
                      <TableRow key={row.period}>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {row.period}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {formatCurrency(row.payment)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                          {formatCurrency(row.interest)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {formatCurrency(row.principal)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums font-medium">
                          {formatCurrency(row.balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
