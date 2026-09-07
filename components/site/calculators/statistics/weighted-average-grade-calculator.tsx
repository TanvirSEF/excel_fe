"use client"

import { useState } from "react"
import { IconAlertTriangle, IconCircleCheck, IconPlus, IconRotate, IconTarget, IconX } from "@tabler/icons-react"

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
import { parseNumericInput } from "@/lib/calculators"
import { formatDecimal, formatPercent } from "@/lib/format"

interface GradeRow {
  name: string
  grade: string
  weight: string
}

const DEFAULT_ROWS: GradeRow[] = [
  { name: "Homeworks", grade: "88", weight: "20" },
  { name: "Midterm Exam", grade: "76", weight: "30" },
  { name: "Lab Project", grade: "92", weight: "20" },
]

const DEFAULT_PLAN = { target: "90", finalWeight: "30" }

function letterGrade(average: number): string {
  if (average >= 93) return "A"
  if (average >= 90) return "A−"
  if (average >= 87) return "B+"
  if (average >= 83) return "B"
  if (average >= 80) return "B−"
  if (average >= 77) return "C+"
  if (average >= 73) return "C"
  if (average >= 70) return "C−"
  if (average >= 67) return "D+"
  if (average >= 60) return "D"
  return "F"
}

export function WeightedAverageGradeCalculator() {
  const [rows, setRows] = useState<GradeRow[]>(DEFAULT_ROWS)
  const [plan, setPlan] = useState(DEFAULT_PLAN)

  const parsed = rows.map((row) => ({
    grade: parseNumericInput(row.grade, { min: 0 }),
    weight: parseNumericInput(row.weight, { min: 0 }),
  }))

  const validPairs = parsed
    .map((p, index) => ({ ...p, index }))
    .filter((p) => p.grade.value !== null && p.weight.value !== null)
    .map((p) => ({
      grade: p.grade.value as number,
      weight: p.weight.value as number,
      index: p.index,
    }))

  const weightSum = validPairs.reduce((total, pair) => total + pair.weight, 0)
  const weightedTotal = validPairs.reduce(
    (total, pair) => total + pair.grade * pair.weight,
    0
  )
  const valid = validPairs.length > 0 && weightSum > 0
  const currentAvg = valid ? weightedTotal / weightSum : null

  const targetInput = parseNumericInput(plan.target, { min: 0, max: 100 })
  const finalWeightInput = parseNumericInput(plan.finalWeight, { min: 0.01, max: 100 })

  const planValid =
    currentAvg !== null && targetInput.value !== null && finalWeightInput.value !== null
  const w = planValid ? finalWeightInput.value! / 100 : 0
  const requiredFinal = planValid
    ? (targetInput.value! - currentAvg * (1 - w)) / w
    : null

  function updateRow(index: number, key: keyof GradeRow, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enter grade &amp; weight data</CardTitle>
            <CardDescription>
              Names are optional. Weights do not need to total 100% yet — the average
              covers whatever you have completed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {rows.map((row, index) => {
                const gradeError =
                  parsed[index].grade.value === null && row.grade !== ""
                    ? parsed[index].grade.error
                    : null
                const weightError =
                  parsed[index].weight.value === null && row.weight !== ""
                    ? parsed[index].weight.error
                    : null
                return (
                  <div
                    key={index}
                    className="flex items-end gap-2 rounded-xl border border-border/70 bg-muted/20 p-3"
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <label
                        htmlFor={`assignment-${index}`}
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Assignment
                      </label>
                      <Input
                        id={`assignment-${index}`}
                        value={row.name}
                        onChange={(event) => updateRow(index, "name", event.target.value)}
                        placeholder="e.g. Homeworks"
                        className="h-9 bg-background text-sm"
                      />
                    </div>
                    <div className="w-24">
                      <NumberField
                        label="Grade"
                        value={row.grade}
                        onChange={(value) => updateRow(index, "grade", value)}
                        error={gradeError}
                        suffix="%"
                        placeholder="88"
                      />
                    </div>
                    <div className="w-24">
                      <NumberField
                        label="Weight"
                        value={row.weight}
                        onChange={(value) => updateRow(index, "weight", value)}
                        error={weightError}
                        suffix="%"
                        placeholder="20"
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
                      aria-label={`Remove ${row.name || `row ${index + 1}`}`}
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
              onClick={() =>
                setRows((current) => [...current, { name: "", grade: "", weight: "" }])
              }
            >
              <IconPlus className="h-4 w-4" />
              Add assignment
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setRows(DEFAULT_ROWS)
                setPlan(DEFAULT_PLAN)
              }}
            >
              <IconRotate className="h-4 w-4" />
              Reset
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {valid && currentAvg !== null ? (
            <ResultsRegion>
              <GradientHeroMetric
                label="Current average"
                value={formatPercent(currentAvg)}
                sub={`Based on ${formatPercent(weightSum, 0)} of the coursework completed`}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile
                  label="Total weight"
                  value={formatPercent(weightSum, 0)}
                  sub={`${100 - weightSum > 0 ? formatPercent(100 - weightSum, 0) : "0%"} of the course remains`}
                />
                <MetricTile
                  label="Letter grade"
                  value={letterGrade(currentAvg)}
                  sub="Standard 10-point scale"
                />
                <MetricTile
                  label="Assignments counted"
                  value={`${validPairs.length}`}
                  sub={`${rows.length - validPairs.length} ignored (invalid or empty)`}
                />
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Weights do not add to 100%? That is fine — the calculator treats your
                completed work as the full picture so far and adjusts as you add more.
              </p>
            </ResultsRegion>
          ) : (
            <ResultsPlaceholder
              title="Enter at least one grade and weight"
              description="Your current average and letter grade appear here instantly."
            />
          )}
        </div>
      </div>

      {valid && currentAvg !== null ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <IconTarget className="h-[18px] w-[18px]" />
              </div>
              <div>
                <CardTitle>Final exam planner</CardTitle>
                <CardDescription>
                  The exact score you need on the final to secure your target grade.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Current %
                </p>
                <p className="mt-1 font-mono text-xl font-bold tabular-nums text-foreground">
                  {formatDecimal(currentAvg, 2)}
                </p>
                <p className="text-[11px] text-muted-foreground">Filled automatically</p>
              </div>
              <div>
                <NumberField
                  label="Target %"
                  value={plan.target}
                  onChange={(value) => setPlan((p) => ({ ...p, target: value }))}
                  error={targetInput.error}
                  hint="e.g. 90 for an A"
                  suffix="%"
                  placeholder="90"
                />
              </div>
              <div>
                <NumberField
                  label="Final weight"
                  value={plan.finalWeight}
                  onChange={(value) => setPlan((p) => ({ ...p, finalWeight: value }))}
                  error={finalWeightInput.error}
                  hint="What the final is worth"
                  suffix="%"
                  placeholder="30"
                />
              </div>
            </div>

            {planValid && requiredFinal !== null ? (
              <div
                className={`flex items-start gap-2.5 rounded-xl border p-4 text-sm leading-relaxed ${
                  requiredFinal > 100
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : requiredFinal <= 0
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-primary/25 bg-primary/5 text-foreground"
                }`}
              >
                {requiredFinal > 100 ? (
                  <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <div>
                  <p className="font-semibold">
                    {requiredFinal > 100
                      ? `You would need ${formatPercent(requiredFinal, 1)} on the final`
                      : requiredFinal <= 0
                        ? "Target already secured"
                        : `Score ${formatPercent(requiredFinal, 1)} or higher on the final`}
                  </p>
                  <p className="mt-1 text-xs">
                    {requiredFinal > 100
                      ? `Not reachable with the final alone — the final is only ${formatPercent(finalWeightInput.value!, 0)} of the grade. Aim for a lower target or line up extra credit.`
                      : requiredFinal <= 0
                        ? `Even a 0 on the final keeps you at or above ${formatPercent(targetInput.value!, 0)} — your target is locked in.`
                        : `Formula: (${formatDecimal(targetInput.value!, 0)} − ${formatDecimal(currentAvg, 2)} × ${formatDecimal(1 - w, 2)}) ÷ ${formatDecimal(w, 2)}`}
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
