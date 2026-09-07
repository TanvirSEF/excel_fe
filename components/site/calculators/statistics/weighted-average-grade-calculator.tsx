"use client"

import { useState } from "react"
import { IconAlertTriangle, IconPlus, IconRotate, IconX } from "@tabler/icons-react"

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
import { formatDecimal, formatPercent } from "@/lib/format"

interface GradeRow {
  grade: string
  weight: string
}

const DEFAULT_ROWS: GradeRow[] = [
  { grade: "85", weight: "20" },
  { grade: "90", weight: "30" },
  { grade: "78", weight: "50" },
]

export function WeightedAverageGradeCalculator() {
  const [rows, setRows] = useState<GradeRow[]>(DEFAULT_ROWS)

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
  const weightedGrade = valid ? weightedTotal / weightSum : null
  const weightsOff = valid && Math.abs(weightSum - 100) > 0.01

  function updateRow(index: number, key: keyof GradeRow, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your grades</CardTitle>
          <CardDescription>
            Enter each grade with the percentage weight it carries in the course.
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
                <div key={index} className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <NumberField
                      label="Grade"
                      value={row.grade}
                      onChange={(value) => updateRow(index, "grade", value)}
                      error={gradeError}
                      suffix="%"
                      placeholder="85"
                    />
                  </div>
                  <div className="w-28">
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
            onClick={() => setRows((current) => [...current, { grade: "", weight: "" }])}
          >
            <IconPlus className="h-4 w-4" />
            Add another grade
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
        {valid && weightedGrade !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Weighted average grade"
              value={formatPercent(weightedGrade)}
              sub="Σ(grade × weight) ÷ Σ(weights)"
            />

            {weightsOff ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Your weights total {formatPercent(weightSum, 0)} instead of 100%. The
                  weighted grade is still computed correctly — some courses list weights
                  that way — but double-check if you expected exactly 100%.
                </p>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Sum of weights" value={formatPercent(weightSum, 0)} />
              <MetricTile
                label="Σ(grade × weight)"
                value={formatDecimal(weightedTotal, 1)}
                sub="Unnormalized weighted total"
              />
              <MetricTile
                label="Grades entered"
                value={`${validPairs.length}`}
                sub={`${rows.length - validPairs.length} ignored (invalid or empty)`}
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "Weighted grade = Σ(gradeᵢ × weightᵢ) ÷ Σ(weightᵢ)" },
                {
                  title: "Substitute",
                  body: `(${validPairs
                    .map((p) => `${formatDecimal(p.grade, 0)}×${formatDecimal(p.weight, 0)}`)
                    .join(" + ")}) ÷ ${formatDecimal(weightSum, 0)}`,
                },
                {
                  title: "Result",
                  body: `${formatDecimal(weightedTotal, 1)} ÷ ${formatDecimal(weightSum, 0)} = ${formatDecimal(weightedGrade, 2)}`,
                },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter at least one grade and weight"
            description="The weighted average grade appears here as soon as one valid grade-weight pair exists."
          />
        )}
      </div>
    </div>
  )
}
