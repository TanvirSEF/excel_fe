"use client"

import { useState } from "react"
import { IconBan, IconCircleCheck, IconPlus, IconRotate, IconX } from "@tabler/icons-react"

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
import { irr } from "@/lib/finance"

const DEFAULT_INVESTMENT = "100000"
const DEFAULT_FLOWS = ["15000", "20000", "25000", "30000"]
const MAX_YEARS = 10

export function IrrCalculator() {
  const [investment, setInvestment] = useState(DEFAULT_INVESTMENT)
  const [flows, setFlows] = useState<string[]>(DEFAULT_FLOWS)

  const parsedInvestment = parseNumericInput(investment, { min: 0.000001 })
  const parsedFlows = flows.map((flow) => parseNumericInput(flow, { min: 0 }))

  const valid =
    parsedInvestment.value !== null && parsedFlows.every((flow) => flow.value !== null)

  const cashFlows = valid
    ? [-parsedInvestment.value!, ...parsedFlows.map((flow) => flow.value!)]
    : []
  const result = valid ? irr(cashFlows) : null
  const totalProfit = valid
    ? cashFlows.reduce((total, cf) => total + cf, 0)
    : 0
  const roi =
    valid && parsedInvestment.value! > 0
      ? (totalProfit / parsedInvestment.value!) * 100
      : null
  const negative = result !== null && result < 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter cash flow data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Initial capital investment ($)"
            value={investment}
            onChange={setInvestment}
            error={parsedInvestment.error}
            hint="This is treated as Year 0 outflow (negative)."
            suffix="$"
            placeholder="100000"
          />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Projected profits (cash in)
          </p>
          {flows.map((flow, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <NumberField
                  label={`Year ${index + 1}`}
                  value={flow}
                  onChange={(v) =>
                    setFlows((current) =>
                      current.map((item, i) => (i === index ? v : item))
                    )
                  }
                  error={parsedFlows[index].error}
                  suffix="$"
                  placeholder="15000"
                />
              </div>
              {flows.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setFlows((current) => current.filter((_, i) => i !== index))
                  }
                  aria-label={`Remove year ${index + 1}`}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          ))}

          {flows.length < MAX_YEARS ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setFlows((current) => [...current, "0"])}
            >
              <IconPlus className="h-4 w-4" />
              Add Another Year
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setInvestment(DEFAULT_INVESTMENT)
              setFlows(DEFAULT_FLOWS)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && result !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Projected rate of return (IRR)"
              value={formatPercent(result * 100, 2)}
            />

            {negative ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs leading-relaxed text-rose-700 dark:text-rose-400">
                <IconBan className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Negative Growth: Project loses capital.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Positive Growth: Project is generating returns.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Total net profit" value={formatCurrency(totalProfit, 0)} sub="All cash flows combined" />
              <MetricTile label="Return on investment" value={roi !== null ? formatPercent(roi, 1) : "—"} sub="Net profit ÷ investment" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your cash flow data"
            description="The projected IRR, net profit and ROI appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
