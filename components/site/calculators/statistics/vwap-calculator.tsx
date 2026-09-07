"use client"

import { useState } from "react"
import { IconCircleCheck, IconPlus, IconRotate, IconX } from "@tabler/icons-react"

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
import { mean } from "@/lib/stats"

interface TradeRow {
  price: string
  volume: string
}

const DEFAULT_ROWS: TradeRow[] = [
  { price: "150.5", volume: "100" },
  { price: "150.75", volume: "500" },
  { price: "149.8", volume: "250" },
]

export function VwapCalculator() {
  const [rows, setRows] = useState<TradeRow[]>(DEFAULT_ROWS)

  const parsed = rows.map((row) => ({
    price: parseNumericInput(row.price, { min: 0.000001 }),
    volume: parseNumericInput(row.volume, { min: 0 }),
  }))

  const trades = parsed
    .map((p, index) => ({ ...p, index }))
    .filter((p) => p.price.value !== null && p.volume.value !== null)
    .map((p) => ({
      price: p.price.value as number,
      volume: p.volume.value as number,
    }))

  const volumeSum = trades.reduce((total, t) => total + t.volume, 0)
  const notional = trades.reduce((total, t) => total + t.price * t.volume, 0)
  const vwap = volumeSum > 0 ? notional / volumeSum : null
  const simpleAvg = trades.length > 0 ? mean(trades.map((t) => t.price)) : null
  const valid = trades.length > 0 && vwap !== null

  function updateRow(index: number, key: keyof TradeRow, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter trade transactions</CardTitle>
          <CardDescription>
            Each fill&apos;s price and share volume — the building blocks of VWAP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {rows.map((row, index) => {
              const priceError =
                parsed[index].price.value === null && row.price !== ""
                  ? parsed[index].price.error
                  : null
              const volumeError =
                parsed[index].volume.value === null && row.volume !== ""
                  ? parsed[index].volume.error
                  : null
              return (
                <div key={index} className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <NumberField
                      label={index === 0 ? "Share price ($)" : "Price"}
                      value={row.price}
                      onChange={(value) => updateRow(index, "price", value)}
                      error={priceError}
                      suffix="$"
                      placeholder="150.5"
                    />
                  </div>
                  <div className="w-28">
                    <NumberField
                      label={index === 0 ? "Volume" : "Shares"}
                      value={row.volume}
                      onChange={(value) => updateRow(index, "volume", value)}
                      error={volumeError}
                      placeholder="100"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mb-0.5 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setRows((current) =>
                        current.length > 1
                          ? current.filter((_, i) => i !== index)
                          : current
                      )
                    }
                    aria-label={`Remove trade ${index + 1}`}
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setRows((current) => [...current, { price: "", volume: "" }])}
          >
            <IconPlus className="h-4 w-4" />
            Add trade
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setRows(DEFAULT_ROWS)}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && vwap !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Volume weighted average price"
              value={formatCurrency(vwap)}
              sub={`The true average price across ${formatDecimal(volumeSum, 0)} shares traded`}
            />

            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
              <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Benchmark calculated — weighted average based on volume.{" "}
                {simpleAvg !== null && simpleAvg !== vwap
                  ? `The simple average (${formatCurrency(simpleAvg)}) ignores volume and tells a different story.`
                  : ""}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Total volume"
                value={formatDecimal(volumeSum, 0)}
                sub="Shares traded"
              />
              <MetricTile
                label="Total traded value"
                value={formatCurrency(notional)}
                sub="Σ(price × volume)"
              />
              <MetricTile
                label="Simple avg price"
                value={simpleAvg !== null ? formatCurrency(simpleAvg) : "—"}
                sub="Ignores volume — for comparison"
              />
            </div>

            <StepList
              steps={[
                {
                  title: "Per-trade value",
                  body: trades
                    .slice(0, 4)
                    .map((t) => `${formatDecimal(t.price, 2)}×${formatDecimal(t.volume, 0)}`)
                    .join(" + ") + (trades.length > 4 ? " + …" : ""),
                },
                {
                  title: "Divide by total volume",
                  body: `${formatCurrency(notional)} ÷ ${formatDecimal(volumeSum, 0)} shares`,
                },
                { title: "Result", body: `VWAP = ${formatCurrency(vwap)}` },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Trading below VWAP suggests a favorable entry for buys (above for sells).
              Institutional benchmarks often measure execution quality against the
              day&apos;s VWAP.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter prices and volumes"
            description="VWAP appears here as soon as one valid price-volume pair exists."
          />
        )}
      </div>
    </div>
  )
}
