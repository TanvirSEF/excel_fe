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
import { formatCurrency, formatDecimal } from "@/lib/format"

const DEFAULTS = {
  inventory: "50000",
  cogs: "365000",
  receivables: "60000",
  revenue: "730000",
  payables: "40000",
}

export function CashConversionCycleCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const inventory = parseNumericInput(values.inventory, { min: 0.000001 })
  const cogs = parseNumericInput(values.cogs, { min: 0.000001 })
  const receivables = parseNumericInput(values.receivables, { min: 0 })
  const revenue = parseNumericInput(values.revenue, { min: 0.000001 })
  const payables = parseNumericInput(values.payables, { min: 0 })

  const valid = [inventory, cogs, receivables, revenue, payables].every((f) => f.value !== null)

  const dio = valid ? (inventory.value! / cogs.value!) * 365 : 0
  const dso = valid ? (receivables.value! / revenue.value!) * 365 : 0
  const dpo = valid ? (payables.value! / cogs.value!) * 365 : 0
  const ccc = dio + dso - dpo

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Working capital inputs</CardTitle>
          <CardDescription>
            Average balances from the balance sheet and annual totals from the income statement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Average inventory" value={values.inventory} onChange={(v) => update("inventory", v)} error={inventory.error} suffix="$" placeholder="50000" />
          <NumberField label="Annual COGS" value={values.cogs} onChange={(v) => update("cogs", v)} error={cogs.error} suffix="$" placeholder="365000" />
          <NumberField label="Average accounts receivable" value={values.receivables} onChange={(v) => update("receivables", v)} error={receivables.error} suffix="$" placeholder="60000" />
          <NumberField label="Annual revenue" value={values.revenue} onChange={(v) => update("revenue", v)} error={revenue.error} suffix="$" placeholder="730000" />
          <NumberField label="Average accounts payable" value={values.payables} onChange={(v) => update("payables", v)} error={payables.error} suffix="$" placeholder="40000" />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Cash conversion cycle"
              value={`${formatDecimal(ccc, 1)} days`}
              sub="How long a dollar stays tied up between paying suppliers and collecting from customers"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="DIO — inventory days"
                value={`${formatDecimal(dio, 1)} d`}
                sub={`${formatCurrency(inventory.value!, 0)} ÷ COGS × 365`}
              />
              <MetricTile
                label="DSO — receivable days"
                value={`${formatDecimal(dso, 1)} d`}
                sub={`${formatCurrency(receivables.value!, 0)} ÷ revenue × 365`}
              />
              <MetricTile
                label="DPO — payable days"
                value={`${formatDecimal(dpo, 1)} d`}
                sub={`${formatCurrency(payables.value!, 0)} ÷ COGS × 365 — the financing offset`}
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "CCC = DIO + DSO − DPO" },
                {
                  title: "Substitute",
                  body: `${formatDecimal(dio, 1)} + ${formatDecimal(dso, 1)} − ${formatDecimal(dpo, 1)}`,
                },
                { title: "Result", body: `CCC = ${formatDecimal(ccc, 1)} days` },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Shorter is better: Amazon famously runs a negative CCC — customers pay
              before suppliers are due. Every day cut from the CCC frees working capital.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter balance sheet averages"
            description="DIO, DSO, DPO and the cash conversion cycle appear here."
          />
        )}
      </div>
    </div>
  )
}
