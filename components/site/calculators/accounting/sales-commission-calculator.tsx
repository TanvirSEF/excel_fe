"use client"

import { useState } from "react"
import { IconAlertTriangle, IconInfoCircle, IconRocket, IconRotate } from "@tabler/icons-react"

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = {
  baseSalary: "2500",
  revenue: "55000",
  quota: "40000",
  baseRate: "10",
  acceleratorRate: "15",
}

export function SalesCommissionCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const [accelerators, setAccelerators] = useState<"flat" | "tiered">("tiered")
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const baseSalary = parseNumericInput(values.baseSalary, { min: 0 })
  const revenue = parseNumericInput(values.revenue, { min: 0 })
  const quota = parseNumericInput(values.quota, { min: 0.000001 })
  const baseRate = parseNumericInput(values.baseRate, { min: 0, max: 100 })
  const acceleratorRate = parseNumericInput(values.acceleratorRate, { min: 0, max: 100 })

  const valid = [baseSalary, revenue, quota, baseRate, acceleratorRate].every(
    (field) => field.value !== null
  )

  const tiered = accelerators === "tiered"
  const commission = valid
    ? tiered
      ? Math.min(revenue.value!, quota.value!) * (baseRate.value! / 100) +
        Math.max(0, revenue.value! - quota.value!) * (acceleratorRate.value! / 100)
      : revenue.value! * (baseRate.value! / 100)
    : 0
  const totalEarnings = valid ? baseSalary.value! + commission : 0
  const attainment =
    valid && tiered ? (revenue.value! / quota.value!) * 100 : null
  const quotaCrushed = attainment !== null && attainment >= 100

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sales earnings calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Sales performance
          </p>
          <NumberField label="Base salary ($)" value={values.baseSalary} onChange={(v) => update("baseSalary", v)} error={baseSalary.error} suffix="$" placeholder="2500" />
          <NumberField label="Total revenue sold ($)" value={values.revenue} onChange={(v) => update("revenue", v)} error={revenue.error} suffix="$" placeholder="55000" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Commission rates
          </p>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Enable accelerators</p>
            <Tabs
              value={accelerators}
              onValueChange={(value) => setAccelerators(value === "tiered" ? "tiered" : "flat")}
            >
              <TabsList className="w-full">
                <TabsTrigger value="flat" className="flex-1">Flat Rate</TabsTrigger>
                <TabsTrigger value="tiered" className="flex-1">Accelerators</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <NumberField label="Base commission rate (%)" value={values.baseRate} onChange={(v) => update("baseRate", v)} error={baseRate.error} hint={tiered ? "Applies up to the quota" : "Applies to all revenue"} suffix="%" placeholder="10" />
          {tiered ? (
            <>
              <NumberField label="Sales quota target ($)" value={values.quota} onChange={(v) => update("quota", v)} error={quota.error} suffix="$" placeholder="40000" />
              <NumberField label="Accelerator rate (%)" value={values.acceleratorRate} onChange={(v) => update("acceleratorRate", v)} error={acceleratorRate.error} hint="Applies to revenue above quota" suffix="%" placeholder="15" />
            </>
          ) : null}

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Total gross earnings"
              value={formatCurrency(totalEarnings)}
            />

            {attainment !== null ? (
              quotaCrushed ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                  <IconRocket className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>Quota Crushed! {formatPercent(attainment, 0)} attainment achieved.</p>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                  <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>Below Quota: {formatPercent(attainment, 0)} attainment achieved.</p>
                </div>
              )
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Flat Rate: Base rate applied to all revenue.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Commission" value={formatCurrency(commission)} sub={tiered ? "Base rate + accelerator" : "Revenue × base rate"} />
              <MetricTile label="Base pay" value={formatCurrency(baseSalary.value!)} sub="Fixed income" />
              <MetricTile label="Quota attainment" value={attainment !== null ? `${formatPercent(attainment, 1)} of quota` : "—"} sub={tiered ? "Revenue ÷ quota" : "Flat rate plan"} />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your sales performance"
            description="Total earnings, commission and quota attainment appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
