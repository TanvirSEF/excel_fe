"use client"

import { useState } from "react"
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconPlus,
  IconRotate,
  IconX,
} from "@tabler/icons-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { parseNumericInput } from "@/lib/calculators"
import { formatDecimal, formatPercent } from "@/lib/format"
import { noiseTwa, weightedMean } from "@/lib/stats"

type Mode = "osha" | "niosh" | "chemical"

interface ExposureRow {
  level: string
  hours: string
}

const DEFAULT_ROWS: ExposureRow[] = [
  { level: "95", hours: "2" },
  { level: "90", hours: "4" },
  { level: "85", hours: "2" },
]

const CHEMICAL_DEFAULTS: ExposureRow[] = [
  { level: "35", hours: "4" },
  { level: "18", hours: "4" },
]

export function TimeWeightedAverageCalculator() {
  const [mode, setMode] = useState<Mode>("osha")
  const [rows, setRows] = useState<ExposureRow[]>(DEFAULT_ROWS)

  const isNoise = mode === "osha" || mode === "niosh"
  const levelLabel = isNoise ? "Noise level (dBA)" : "Level (ppm / mg/m³)"

  const parsed = rows.map((row) => ({
    level: parseNumericInput(row.level, { min: 0 }),
    hours: parseNumericInput(row.hours, { min: 0 }),
  }))

  const validPairs = parsed
    .map((p, index) => ({ ...p, index }))
    .filter((p) => p.level.value !== null && p.hours.value !== null)
    .map((p) => ({
      level: p.level.value as number,
      hours: p.hours.value as number,
      index: p.index,
    }))

  const noiseResult = isNoise && validPairs.length > 0 ? noiseTwa(validPairs, mode) : null
  const chemicalResult =
    mode === "chemical" && validPairs.length > 0
      ? weightedMean(validPairs.map((p) => ({ value: p.level, weight: p.hours })))
      : null

  const totalHours = validPairs.reduce((total, p) => total + p.hours, 0)
  const valid = isNoise ? noiseResult !== null : chemicalResult !== null

  let verdict: { kind: "safe" | "action" | "hazard"; text: string } | null = null
  if (mode === "osha" && noiseResult) {
    verdict =
      noiseResult.twa >= 90
        ? {
            kind: "hazard",
            text: `Hazardous — ${formatDecimal(noiseResult.twa, 1)} dBA reaches the OSHA permissible exposure limit (PEL) of 90 dBA. Hearing protection is mandatory.`,
          }
        : noiseResult.twa >= 85
          ? {
              kind: "action",
              text: `Action level — ${formatDecimal(noiseResult.twa, 1)} dBA is between 85 and 90 dBA. A Hearing Conservation Program is required: free hearing protection and yearly hearing tests.`,
            }
          : {
              kind: "safe",
              text: `Safe — ${formatDecimal(noiseResult.twa, 1)} dBA stays below the 85 dBA action level. No action required.`,
            }
  }
  if (mode === "niosh" && noiseResult) {
    verdict =
      noiseResult.twa >= 85
        ? {
            kind: "hazard",
            text: `Exceeds the NIOSH recommended limit — ${formatDecimal(noiseResult.twa, 1)} dBA is at or above 85 dBA. NIOSH recommends reducing exposure or wearing strong protection.`,
          }
        : {
            kind: "safe",
            text: `Below the NIOSH recommended exposure limit of 85 dBA (${formatDecimal(noiseResult.twa, 1)} dBA).`,
          }
  }

  function switchMode(next: string) {
    const value = (next === "niosh" ? "niosh" : next === "chemical" ? "chemical" : "osha") as Mode
    setMode(value)
    setRows(value === "chemical" ? CHEMICAL_DEFAULTS : DEFAULT_ROWS)
  }

  function updateRow(index: number, key: keyof ExposureRow, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enter exposure data</CardTitle>
            <CardDescription>
              Spot readings from a sound level meter with how long each lasted. The
              calculator handles the logarithmic decibel math.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Exposure standard
              </p>
              <Select value={mode} onValueChange={switchMode}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick a standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="osha">OSHA Noise (90 dBA limit)</SelectItem>
                  <SelectItem value="niosh">NIOSH Noise (85 dBA limit)</SelectItem>
                  <SelectItem value="chemical">
                    Simple / Chemical (ppm, mg/m³)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {rows.map((row, index) => {
                const levelError =
                  parsed[index].level.value === null && row.level !== ""
                    ? parsed[index].level.error
                    : null
                const hoursError =
                  parsed[index].hours.value === null && row.hours !== ""
                    ? parsed[index].hours.error
                    : null
                return (
                  <div key={index} className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <NumberField
                        label={index === 0 ? levelLabel : isNoise ? "dBA" : "Level"}
                        value={row.level}
                        onChange={(value) => updateRow(index, "level", value)}
                        error={levelError}
                        placeholder="95"
                      />
                    </div>
                    <div className="w-28">
                      <NumberField
                        label="Hours"
                        value={row.hours}
                        onChange={(value) => updateRow(index, "hours", value)}
                        error={hoursError}
                        placeholder="2"
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
                      aria-label={`Remove row ${index + 1}`}
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
              onClick={() => setRows((current) => [...current, { level: "", hours: "" }])}
            >
              <IconPlus className="h-4 w-4" />
              Add exposure row
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setRows(mode === "chemical" ? CHEMICAL_DEFAULTS : DEFAULT_ROWS)}
            >
              <IconRotate className="h-4 w-4" />
              Reset
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {valid && isNoise && noiseResult ? (
            <ResultsRegion>
              <GradientHeroMetric
                label="8-hour TWA"
                value={`${formatDecimal(noiseResult.twa, 1)} dBA`}
                sub={
                  mode === "osha"
                    ? "OSHA 5 dB exchange rate · 90 dBA criterion"
                    : "NIOSH 3 dB exchange rate · 85 dBA criterion"
                }
              />

              {verdict ? (
                <div
                  className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                    verdict.kind === "hazard"
                      ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
                      : verdict.kind === "action"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  {verdict.kind === "safe" ? (
                    <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <p>{verdict.text}</p>
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile
                  label="Total dose"
                  value={formatPercent(noiseResult.dose, 1)}
                  sub="100% = a full day's legal limit"
                />
                <MetricTile
                  label="Exposure time"
                  value={`${formatDecimal(noiseResult.totalHours, 1)} h`}
                  sub="Converted to a standard 8-hour day"
                />
                <MetricTile
                  label="Dose limit"
                  value={mode === "osha" ? "90 dBA PEL" : "85 dBA REL"}
                  sub={
                    mode === "osha"
                      ? "Federal legal limit (USA)"
                      : "Recommended scientific limit"
                  }
                />
              </div>

              <StepList
                steps={[
                  {
                    title: "Allowed time per level",
                    body: validPairs
                      .slice(0, 3)
                      .map(
                        (p, i) =>
                          `${formatDecimal(p.level, 0)} dBA → ${formatDecimal(noiseResult.allowedTimes[i], 1)} h allowed`
                      )
                      .join(" · "),
                  },
                  {
                    title: "Dose",
                    body: validPairs
                      .slice(0, 3)
                      .map(
                        (p, i) =>
                          `${formatDecimal(p.hours, 0)}/${formatDecimal(noiseResult.allowedTimes[i], 1)}`
                      )
                      .join(" + ") + ` = ${formatPercent(noiseResult.dose, 1)}`,
                  },
                  {
                    title:
                      mode === "osha"
                        ? "TWA = 16.61 × log₁₀(Dose ÷ 100) + 90"
                        : "TWA = 10 × log₁₀(Dose ÷ 100) + 85",
                    body: `= ${formatDecimal(noiseResult.twa, 1)} dBA`,
                  },
                ]}
              />
            </ResultsRegion>
          ) : valid && mode === "chemical" && chemicalResult !== null ? (
            <ResultsRegion>
              <GradientHeroMetric
                label="8-hour TWA"
                value={formatDecimal(chemicalResult, 2)}
                sub="Simple linear average — for chemical exposure in ppm or mg/m³"
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile
                  label="Exposure time"
                  value={`${formatDecimal(totalHours, 1)} h`}
                  sub="Across all rows"
                />
                <MetricTile
                  label="Weighted total"
                  value={formatDecimal(
                    validPairs.reduce((t, p) => t + p.level * p.hours, 0),
                    1
                  )}
                  sub="Σ(level × hours)"
                />
                <MetricTile
                  label="Rows counted"
                  value={`${validPairs.length}`}
                  sub={`${rows.length - validPairs.length} ignored`}
                />
              </div>

              <StepList
                steps={[
                  { title: "Formula", body: "TWA = Σ(level × hours) ÷ Σ(hours)" },
                  {
                    title: "Substitute",
                    body: `(${validPairs.map((p) => `${formatDecimal(p.level, 0)}×${formatDecimal(p.hours, 0)}`).join(" + ")}) ÷ ${formatDecimal(totalHours, 0)}`,
                  },
                  { title: "Result", body: `TWA = ${formatDecimal(chemicalResult, 2)}` },
                ]}
              />
            </ResultsRegion>
          ) : (
            <ResultsPlaceholder
              title="Enter exposure readings"
              description="Each noise level with its duration — the 8-hour TWA and dose appear here."
            />
          )}
        </div>
      </div>
    </div>
  )
}
