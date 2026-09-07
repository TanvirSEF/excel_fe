"use client"

import { useState } from "react"
import { IconPlus, IconRotate, IconX } from "@tabler/icons-react"

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
  { price: "100", volume: "200" },
  { price: "102", volume: "300" },
  { price: "98", volume: "500" },
]

export function VwapCalculator() {
  const [rows, setRows] = useState<TradeRow[]>(DEFAULT_ROWS)

  const parsed = rows.map((row) => ({
    price: parseNumericInput(row.price, { min: 0 }),
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
          <CardTitle>Your trades</CardTitle>
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
                      label="Price"
                      value={row.price}
                      onChange={(value) => updateRow(index, "price", value)}
                      error={priceError}
                      suffix="$"
                      placeholder="100"
                    />
                  </div>
                  <div className="w-32">
                    <NumberField
                      label="Volume"
                      value={row.volume}
                      onChange={(value) => updateRow(index, "volume", value)}
                      error={volumeError}
                      placeholder="200"
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
            Add another trade
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setRows(DEFAULT_ROWS)}
          >
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && vwap !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="VWAP"
              value={formatCurrency(vwap)}
              sub="Σ(price × volume) ÷ Σ(volume)"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Total volume"
                value={formatDecimal(volumeSum, 0)}
                sub="Shares traded"
              />
              <MetricTile
                label="Notional traded"
                value={formatCurrency(notional)}
                sub="Σ(price × volume)"
              />
              <MetricTile
                label="Trades"
                value={`${trades.length}`}
                sub={`${rows.length - trades.length} ignored (invalid or empty)`}
              />
              <MetricTile
                label="Simple mean price"
                value={formatCurrency(mean(trades.map((t) => t.price)))}
                sub="Ignores volume — for comparison"
              />
            </div>

            <StepList
              steps={[
                {
                  title: "Notional per trade",
                  body: trades
                    .slice(0, 4)
                    .map((t) => `${formatDecimal(t.price, 0)}×${formatDecimal(t.volume, 0)}`)
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
              Trading below VWAP suggests a favorable entry for buys (and above it for
              sells). Institutional benchmarks often measure execution quality against
              the day&apos;s VWAP.
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
