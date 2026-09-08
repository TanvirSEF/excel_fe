"use client"

import { useState } from "react"
import { IconCircleCheck, IconInfoCircle, IconRotate } from "@tabler/icons-react"

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

const DEFAULTS = {
  price: "300000",
  closing: "6000",
  repairs: "15000",
  rent: "2500",
  vacancy: "5",
  taxes: "3600",
  insurance: "1200",
  maintenance: "2000",
  management: "8",
  other: "1000",
}

function roiVerdict(roi: number): {
  kind: "low" | "moderate" | "high"
  text: string
} {
  if (roi < 4) return { kind: "low", text: "Low Yield: Below the typical cash-buyer range." }
  if (roi <= 8) return { kind: "moderate", text: "Moderate Yield: Standard performance." }
  return { kind: "high", text: "High Yield: Strong performance for a cash buyer." }
}

export function RentalPropertyRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const price = parseNumericInput(values.price, { min: 1 })
  const closing = parseNumericInput(values.closing, { min: 0 })
  const repairs = parseNumericInput(values.repairs, { min: 0 })
  const rent = parseNumericInput(values.rent, { min: 0 })
  const vacancy = parseNumericInput(values.vacancy, { min: 0, max: 100 })
  const taxes = parseNumericInput(values.taxes, { min: 0 })
  const insurance = parseNumericInput(values.insurance, { min: 0 })
  const maintenance = parseNumericInput(values.maintenance, { min: 0 })
  const management = parseNumericInput(values.management, { min: 0, max: 100 })
  const other = parseNumericInput(values.other, { min: 0 })

  const fields = [price, closing, repairs, rent, vacancy, taxes, insurance, maintenance, management, other]
  const valid = fields.every((field) => field.value !== null)

  const totalInvestment = valid
    ? price.value! + closing.value! + repairs.value!
    : 0
  const grossAnnualRent = valid ? rent.value! * 12 : 0
  const vacancyLoss = valid ? grossAnnualRent * (vacancy.value! / 100) : 0
  const effectiveGrossIncome = valid ? grossAnnualRent - vacancyLoss : 0
  const managementFee = valid ? effectiveGrossIncome * (management.value! / 100) : 0
  const operatingExpenses = valid
    ? taxes.value! + insurance.value! + maintenance.value! + managementFee + other.value!
    : 0
  const noi = valid ? effectiveGrossIncome - operatingExpenses : 0
  const roi = valid && totalInvestment > 0 ? (noi / totalInvestment) * 100 : null
  const monthlyNet = valid ? noi / 12 : 0
  const verdict = roi !== null ? roiVerdict(roi) : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter property financials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Acquisition costs
          </p>
          <NumberField label="Purchase price" value={values.price} onChange={(v) => update("price", v)} error={price.error} suffix="$" placeholder="300000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Closing costs" value={values.closing} onChange={(v) => update("closing", v)} error={closing.error} suffix="$" placeholder="6000" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Repairs/renovation" value={values.repairs} onChange={(v) => update("repairs", v)} error={repairs.error} suffix="$" placeholder="15000" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Monthly income
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Gross rent ($)" value={values.rent} onChange={(v) => update("rent", v)} error={rent.error} suffix="$" placeholder="2500" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Vacancy rate (%)" value={values.vacancy} onChange={(v) => update("vacancy", v)} error={vacancy.error} suffix="%" placeholder="5" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            3. Annual expenses
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Taxes ($)" value={values.taxes} onChange={(v) => update("taxes", v)} error={taxes.error} suffix="$" placeholder="3600" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Insurance ($)" value={values.insurance} onChange={(v) => update("insurance", v)} error={insurance.error} suffix="$" placeholder="1200" />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Maintenance ($)" value={values.maintenance} onChange={(v) => update("maintenance", v)} error={maintenance.error} suffix="$" placeholder="2000" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Management fee (%)" value={values.management} onChange={(v) => update("management", v)} error={management.error} suffix="%" placeholder="8" />
            </div>
          </div>
          <NumberField label="Other ($)" value={values.other} onChange={(v) => update("other", v)} error={other.error} suffix="$" placeholder="1000" />

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && roi !== null && verdict ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Annual net ROI"
              value={formatPercent(roi, 2)}
              sub={`${formatCurrency(noi, 0)}/yr`}
            />

            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
              {verdict.kind === "moderate" ? (
                <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <p>{verdict.text}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Total cost basis" value={formatCurrency(totalInvestment, 0)} sub="Price + closing + repairs" />
              <MetricTile label="Adjusted gross income" value={formatCurrency(effectiveGrossIncome, 0)} sub="Rent − vacancy loss" />
              <MetricTile label="Operating expenses" value={formatCurrency(operatingExpenses, 0)} sub="Taxes, insurance, mgmt & more" />
              <MetricTile label="Monthly net profit" value={formatCurrency(monthlyNet, 0)} sub="NOI ÷ 12" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your property financials"
            description="Cash-on-cash ROI, NOI and monthly profit appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
