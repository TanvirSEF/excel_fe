"use client"

import { useState } from "react"
import {
  IconAlertTriangle,
  IconPlus,
  IconRotate,
  IconX,
} from "@tabler/icons-react"

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
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { parseNumericInput } from "@/lib/calculators"
import { calculateNpv } from "@/lib/calc-npv"
import { cn } from "@/lib/utils"
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/format"

const DEFAULT_FLOWS = ["500", "400", "300", "100"]
const DEFAULTS = {
  initialInvestment: "1000",
  discountRate: "10",
}

const MIN_FLOWS = 1
const MAX_FLOWS = 30

export function NpvIrrCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(
    DEFAULTS.initialInvestment
  )
  const [discountRate, setDiscountRate] = useState(DEFAULTS.discountRate)
  const [cashFlows, setCashFlows] = useState<string[]>(() => DEFAULT_FLOWS.slice())

  const initialInput = parseNumericInput(initialInvestment, { min: 0.01 })
  const rateInput = parseNumericInput(discountRate, { min: 0, max: 100 })
  const flowInputs = cashFlows.map((flow) => parseNumericInput(flow))

  const flowsMissing = flowInputs.some((input) => input.value === null)
  const invalid =
    initialInput.error !== null ||
    rateInput.error !== null ||
    flowInputs.some((input) => input.error !== null)

  const result =
    initialInput.value === null || rateInput.value === null || flowsMissing
      ? null
      : calculateNpv({
          initialInvestment: initialInput.value,
          cashFlows: flowInputs.map((input) => input.value as number),
          discountRatePercent: rateInput.value,
        })

  const totalInflows = result
    ? result.rows.slice(1).reduce((sum, row) => sum + row.cashFlow, 0)
    : 0

  const paybackIndex = result
    ? result.rows.findIndex((row) => row.cumulative >= 0)
    : -1

  const copyRows = result
    ? [
        ["Year", "Cash flow", "Discounted", "Cumulative NPV"],
        ...result.rows.map((row) => [
          String(row.year),
          row.cashFlow.toFixed(2),
          row.discounted.toFixed(2),
          row.cumulative.toFixed(2),
        ]),
      ]
    : []

  function updateFlow(index: number, value: string) {
    setCashFlows((flows) =>
      flows.map((flow, i) => (i === index ? value : flow))
    )
  }

  function removeFlow(index: number) {
    if (cashFlows.length <= MIN_FLOWS) return
    setCashFlows((flows) => flows.filter((_, i) => i !== index))
  }

  function addFlow() {
    if (cashFlows.length >= MAX_FLOWS) return
    setCashFlows((flows) => [...flows, ""])
  }

  function reset() {
    setInitialInvestment(DEFAULTS.initialInvestment)
    setDiscountRate(DEFAULTS.discountRate)
    setCashFlows(DEFAULT_FLOWS.slice())
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Investment cash flows</CardTitle>
            <CardDescription>
              Yearly inflows after the initial outlay — Excel&apos;s NPV
              convention (first flow lands a year in).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberField
              label="Initial investment"
              value={initialInvestment}
              onChange={setInitialInvestment}
              error={initialInput.error}
              hint="Money you put in at year 0"
              suffix="$"
              placeholder="1,000"
            />
            <NumberField
              label="Discount rate"
              value={discountRate}
              onChange={setDiscountRate}
              error={rateInput.error}
              hint="Your hurdle rate — the return the capital could earn elsewhere"
              suffix="%"
              placeholder="10"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Cash flow by year
                </span>
                <span className="text-[11px] text-muted-foreground/70">
                  {cashFlows.length}/{MAX_FLOWS} years
                </span>
              </div>

              <div className="space-y-2">
                {cashFlows.map((flow, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-8 shrink-0 text-right font-mono text-xs text-muted-foreground">
                        Y{index + 1}
                      </span>
                      <div className="relative min-w-0 flex-1">
                        <Input
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          value={flow}
                          onChange={(event) =>
                            updateFlow(index, event.target.value)
                          }
                          placeholder={`Year ${index + 1} inflow`}
                          aria-label={`Year ${index + 1} cash flow`}
                          aria-invalid={
                            flowInputs[index]?.error ? true : undefined
                          }
                          className={cn(
                            "h-10 bg-background pr-8 text-right font-mono text-sm tabular-nums",
                            flowInputs[index]?.error &&
                              "border-destructive/60 focus-visible:ring-destructive/30"
                          )}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-muted-foreground">
                          $
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFlow(index)}
                        disabled={cashFlows.length <= MIN_FLOWS}
                        aria-label={`Remove year ${index + 1}`}
                        className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                    {flowInputs[index]?.error ? (
                      <p className="pl-10 text-[11px] text-destructive">
                        {flowInputs[index].error}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFlow}
                disabled={cashFlows.length >= MAX_FLOWS}
                className="w-full gap-1.5"
              >
                <IconPlus className="h-3.5 w-3.5" />
                Add year
              </Button>
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

        <div className="lg:col-span-3">
          {result && !invalid ? (
            <div className="space-y-3 lg:sticky lg:top-24">
              <ResultsRegion>
                <GradientHeroMetric
                  label={`NPV @ ${rateInput.value}%`}
                  value={formatCurrency(result.npv)}
                  sub={
                    result.npv >= 0
                      ? "Discounted inflows exceed the investment — value is created"
                      : "Discounted inflows fall short of the investment"
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <MetricTile
                    label="Internal rate of return"
                    value={
                      result.irrPercent === null
                        ? "Not found"
                        : formatPercent(result.irrPercent)
                    }
                    sub={
                      result.irrPercent === null
                        ? "No rate makes this series break even"
                        : "The discount rate at which NPV = 0"
                    }
                  />
                  <MetricTile
                    label="Total inflows"
                    value={formatCurrency(totalInflows)}
                    sub={`Undiscounted, over ${cashFlows.length} years`}
                  />
                  <MetricTile
                    label="Profitability index"
                    value={formatMultiple(
                      (result.npv + initialInput.value!) / initialInput.value!
                    )}
                    sub="PV of inflows ÷ investment — above 1.00x adds value"
                  />
                  <MetricTile
                    label="Discounted payback"
                    value={
                      paybackIndex === -1
                        ? "Beyond horizon"
                        : `Year ${paybackIndex}`
                    }
                    sub="When cumulative discounted flows turn positive"
                  />
                </div>
              </ResultsRegion>

              {result.npv < 0 ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                  <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    At {rateInput.value}% the project destroys value — the same
                    money earns more at your hurdle rate. Only proceed for
                    strategic reasons, or renegotiate the entry cost.
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <ResultsPlaceholder
              title={
                invalid
                  ? "Fix the highlighted fields"
                  : "Fill in every cash-flow year"
              }
              description="NPV, IRR and a discounted cash-flow breakdown appear here as soon as the inputs are valid."
            />
          )}
        </div>
      </div>

      {result ? (
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>Discounted cash-flow schedule</CardTitle>
              <CardDescription>
                Every flow discounted at {rateInput.value}% with the running
                cumulative NPV — the shape Excel&apos;s NPV column would show.
              </CardDescription>
            </div>
            <CopyTableButton rows={copyRows} />
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto rounded-xl border border-border/70">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted">
                  <TableRow>
                    <TableHead className="text-right">Year</TableHead>
                    <TableHead className="text-right">Cash flow</TableHead>
                    <TableHead className="text-right">
                      Discounted @ {rateInput.value}%
                    </TableHead>
                    <TableHead className="text-right">Cumulative</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.rows.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {row.year}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-mono text-xs tabular-nums",
                          row.cashFlow < 0 && "text-muted-foreground"
                        )}
                      >
                        {formatCurrency(row.cashFlow)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {formatCurrency(row.discounted)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-mono text-xs tabular-nums font-medium",
                          row.cumulative < 0
                            ? "text-muted-foreground"
                            : "text-primary"
                        )}
                      >
                        {formatCurrency(row.cumulative)}
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
