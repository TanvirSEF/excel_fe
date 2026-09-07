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
  hours1: "30",
  rate1: "20",
  hours2: "20",
  rate2: "30",
  multiplier: "1.5",
  threshold: "40",
}

export function WeightedAverageOvertimeCalculator() {
  const [values, setValues] = useState(DEFAULTS)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const hours1 = parseNumericInput(values.hours1, { min: 0 })
  const rate1 = parseNumericInput(values.rate1, { min: 0 })
  const hours2 = parseNumericInput(values.hours2, { min: 0 })
  const rate2 = parseNumericInput(values.rate2, { min: 0 })
  const multiplier = parseNumericInput(values.multiplier, { min: 1 })
  const threshold = parseNumericInput(values.threshold, { min: 0 })

  const all =
    hours1.value !== null &&
    rate1.value !== null &&
    hours2.value !== null &&
    rate2.value !== null &&
    multiplier.value !== null &&
    threshold.value !== null

  const totalHours = all ? hours1.value! + hours2.value! : 0
  const straightPay = all
    ? hours1.value! * rate1.value! + hours2.value! * rate2.value!
    : 0
  const blendedRate = totalHours > 0 ? straightPay / totalHours : null
  const otHours = all ? Math.max(0, totalHours - threshold.value!) : 0
  const otRate = blendedRate !== null ? blendedRate * multiplier.value! : null
  const premiumRate = otRate !== null ? otRate - blendedRate! : null
  const otPremium = premiumRate !== null ? premiumRate * otHours : 0
  const totalPay = straightPay + otPremium
  const valid = all && blendedRate !== null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Two jobs, one week</CardTitle>
          <CardDescription>
            The FLSA weighted-average method for blended overtime across different pay
            rates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Job 1
          </p>
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField
                label="Hours"
                value={values.hours1}
                onChange={(v) => update("hours1", v)}
                error={hours1.error}
                placeholder="30"
              />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField
                label="Hourly rate"
                value={values.rate1}
                onChange={(v) => update("rate1", v)}
                error={rate1.error}
                suffix="$"
                placeholder="20"
              />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Job 2
          </p>
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField
                label="Hours"
                value={values.hours2}
                onChange={(v) => update("hours2", v)}
                error={hours2.error}
                placeholder="20"
              />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField
                label="Hourly rate"
                value={values.rate2}
                onChange={(v) => update("rate2", v)}
                error={rate2.error}
                suffix="$"
                placeholder="30"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <NumberField
                label="OT multiplier"
                value={values.multiplier}
                onChange={(v) => update("multiplier", v)}
                error={multiplier.error}
                hint="1.5 = time-and-a-half"
                placeholder="1.5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField
                label="OT after (hours)"
                value={values.threshold}
                onChange={(v) => update("threshold", v)}
                error={threshold.error}
                hint="Usually 40 per week"
                placeholder="40"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setValues(DEFAULTS)}
          >
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && blendedRate !== null && otRate !== null && premiumRate !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Blended regular rate"
              value={formatCurrency(blendedRate)}
              sub="Total straight-time pay ÷ total hours"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Overtime rate"
                value={formatCurrency(otRate)}
                sub={`Blended rate × ${formatDecimal(multiplier.value!, 2)}`}
              />
              <MetricTile
                label="OT half-time premium"
                value={`${formatCurrency(premiumRate)}/h`}
                sub="The extra half (or more) per OT hour"
              />
              <MetricTile
                label="Total hours / OT hours"
                value={`${formatDecimal(totalHours, 1)} / ${formatDecimal(otHours, 1)}`}
                sub={`OT beyond ${formatDecimal(threshold.value!, 0)}h`}
              />
              <MetricTile
                label="Total weekly pay"
                value={formatCurrency(totalPay)}
                sub={`${formatCurrency(straightPay)} + ${formatCurrency(otPremium)} OT premium`}
              />
            </div>

            <StepList
              steps={[
                {
                  title: "Blended regular rate",
                  body: `(${formatDecimal(hours1.value!, 0)}h × ${formatCurrency(rate1.value!, 0)} + ${formatDecimal(hours2.value!, 0)}h × ${formatCurrency(rate2.value!, 0)}) ÷ ${formatDecimal(totalHours, 0)}h = ${formatCurrency(blendedRate)}`,
                },
                {
                  title: "Overtime rate",
                  body: `${formatCurrency(blendedRate)} × ${formatDecimal(multiplier.value!, 2)} = ${formatCurrency(otRate)}`,
                },
                {
                  title: "Premium due",
                  body: `(${formatCurrency(otRate)} − ${formatCurrency(blendedRate)}) × ${formatDecimal(otHours, 0)} OT h = ${formatCurrency(otPremium)}`,
                },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Under the FLSA weighted-average method, overtime is paid on the blended
              rate — not the higher single-job rate. Both jobs already paid straight
              time for every hour, so only the premium above the blended rate is added
              for overtime hours.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter both jobs' hours and rates"
            description="The blended rate, overtime rate and full weekly pay appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
