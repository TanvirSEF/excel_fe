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
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = {
  price: "250000",
  rent: "2000",
  tax: "3000",
  insurance: "1200",
  maintenance: "10",
  vacancy: "5",
}

export function RentalPropertyRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const price = parseNumericInput(values.price, { min: 1 })
  const rent = parseNumericInput(values.rent, { min: 0 })
  const tax = parseNumericInput(values.tax, { min: 0 })
  const insurance = parseNumericInput(values.insurance, { min: 0 })
  const maintenance = parseNumericInput(values.maintenance, { min: 0, max: 100 })
  const vacancy = parseNumericInput(values.vacancy, { min: 0, max: 100 })

  const valid = [price, rent, tax, insurance, maintenance, vacancy].every(
    (field) => field.value !== null
  )

  const grossIncome = valid ? rent.value! * 12 : 0
  const maintenanceCost = valid ? (maintenance.value! / 100) * grossIncome : 0
  const vacancyCost = valid ? (vacancy.value! / 100) * grossIncome : 0
  const operatingCost = valid
    ? tax.value! + insurance.value! + maintenanceCost + vacancyCost
    : 0
  const noi = grossIncome - operatingCost
  const capRate = valid && price.value! > 0 ? (noi / price.value!) * 100 : null
  const grossYield = valid && price.value! > 0 ? (grossIncome / price.value!) * 100 : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Property numbers</CardTitle>
          <CardDescription>
            All-cash view of the deal — the cap rate investors compare deals with.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Purchase price" value={values.price} onChange={(v) => update("price", v)} error={price.error} suffix="$" placeholder="250000" />
          <NumberField label="Monthly rent" value={values.rent} onChange={(v) => update("rent", v)} error={rent.error} suffix="$" placeholder="2000" />
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Property tax / yr" value={values.tax} onChange={(v) => update("tax", v)} error={tax.error} suffix="$" placeholder="3000" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Insurance / yr" value={values.insurance} onChange={(v) => update("insurance", v)} error={insurance.error} suffix="$" placeholder="1200" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Maintenance" value={values.maintenance} onChange={(v) => update("maintenance", v)} error={maintenance.error} hint="Of gross rent — 8–12% typical" suffix="%" placeholder="10" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Vacancy allowance" value={values.vacancy} onChange={(v) => update("vacancy", v)} error={vacancy.error} hint="Of gross rent — 5% typical" suffix="%" placeholder="5" />
            </div>
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && capRate !== null && grossYield !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Cap rate"
              value={formatPercent(capRate)}
              sub="Net operating income ÷ purchase price — the all-cash return"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Net operating income"
                value={formatCurrency(noi, 0)}
                sub={`${formatCurrency(noi / 12, 0)} per month`}
              />
              <MetricTile
                label="Gross yield"
                value={formatPercent(grossYield)}
                sub="Rent ÷ price before expenses"
              />
              <MetricTile
                label="Operating costs"
                value={formatCurrency(operatingCost, 0)}
                sub="Tax + insurance + maintenance + vacancy"
              />
            </div>

            <StepList
              steps={[
                {
                  title: "Gross income",
                  body: `${formatCurrency(rent.value!, 0)} × 12 = ${formatCurrency(grossIncome, 0)}`,
                },
                {
                  title: "Less operating costs",
                  body: `${formatCurrency(grossIncome, 0)} − (${formatCurrency(tax.value!, 0)} + ${formatCurrency(insurance.value!, 0)} + ${formatCurrency(maintenanceCost, 0)} + ${formatCurrency(vacancyCost, 0)}) = ${formatCurrency(noi, 0)}`,
                },
                {
                  title: "Cap rate",
                  body: `${formatCurrency(noi, 0)} ÷ ${formatCurrency(price.value!, 0)} = ${formatPercent(capRate)}`,
                },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter the property's numbers"
            description="Cap rate, NOI and gross yield — the deal's real profitability — appear here."
          />
        )}
      </div>
    </div>
  )
}
