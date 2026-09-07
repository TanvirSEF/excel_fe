"use client"

import { useMemo, useState } from "react"
import { IconAlertTriangle, IconPlus, IconRotate, IconX } from "@tabler/icons-react"

import { CopyTableButton } from "@/components/site/calculators/copy-table-button"
import { DataSetField } from "@/components/site/calculators/statistics/data-set-field"
import {
  GradientHeroMetric,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDecimal, formatPValue } from "@/lib/format"
import { oneWayAnova, parseDataSet } from "@/lib/stats"

const DEFAULT_GROUPS = ["3, 4, 5", "7, 8, 9", "10, 11, 12"]

export function OneWayAnovaCalculator() {
  const [groups, setGroups] = useState<string[]>(DEFAULT_GROUPS)

  const parsed = groups.map((raw) => parseDataSet(raw))
  const usable = parsed.filter((g) => g.invalid.length === 0 && g.values.length >= 2)
  const groupsKey = groups.join("|")

  const result = useMemo(
    () => (usable.length >= 2 ? oneWayAnova(usable.map((g) => g.values)) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupsKey]
  )

  const invalidGroups = parsed.some((g) => g.invalid.length > 0)
  const smallGroups = parsed.filter((g) => g.invalid.length === 0 && g.values.length < 2)
  const significant = result !== null && result.p < 0.05

  const anovaRows = result
    ? [
        {
          source: "Between groups",
          ss: result.ssBetween,
          df: result.dfBetween,
          ms: result.msBetween,
          f: result.f,
          p: result.p,
        },
        {
          source: "Within groups",
          ss: result.ssWithin,
          df: result.dfWithin,
          ms: result.msWithin,
          f: null,
          p: null,
        },
        {
          source: "Total",
          ss: result.ssBetween + result.ssWithin,
          df: result.dfBetween + result.dfWithin,
          ms: null,
          f: null,
          p: null,
        },
      ]
    : []

  const copyRows = result
    ? [
        ["Source", "SS", "df", "MS", "F", "p"],
        ...anovaRows.map((row) => [
          row.source,
          formatDecimal(row.ss, 2),
          String(row.df),
          row.ms !== null ? formatDecimal(row.ms, 2) : "",
          row.f !== null ? formatDecimal(row.f, 2) : "",
          row.p !== null ? formatPValue(row.p) : "",
        ]),
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Groups</CardTitle>
            <CardDescription>
              Each group needs at least 2 values. Three or more groups is the classic
              one-way setup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {groups.map((raw, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <DataSetField
                    label={`Group ${index + 1}`}
                    value={raw}
                    onChange={(value) =>
                      setGroups((current) =>
                        current.map((g, i) => (i === index ? value : g))
                      )
                    }
                    placeholder="e.g. 3, 4, 5"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setGroups((current) =>
                      current.length > 2
                        ? current.filter((_, i) => i !== index)
                        : current
                    )
                  }
                  aria-label={`Remove group ${index + 1}`}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setGroups((current) => [...current, ""])}
            >
              <IconPlus className="h-4 w-4" />
              Add another group
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setGroups(DEFAULT_GROUPS)}
            >
              <IconRotate className="h-4 w-4" />
              Reset to example
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {result ? (
            <ResultsRegion>
              <GradientHeroMetric
                label="F statistic"
                value={formatDecimal(result.f, 2)}
                sub={`p = ${formatPValue(result.p)} · df (${result.dfBetween}, ${result.dfWithin})`}
              />

              <div
                className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                  significant
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                }`}
              >
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {significant
                    ? `p = ${formatPValue(result.p)} < 0.05 — at least one group mean differs significantly from the others.`
                    : `p = ${formatPValue(result.p)} ≥ 0.05 — no significant difference detected between the group means.`}
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-primary/50 bg-card shadow-2xs">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">SS</TableHead>
                      <TableHead className="text-right">df</TableHead>
                      <TableHead className="text-right">MS</TableHead>
                      <TableHead className="text-right">F</TableHead>
                      <TableHead className="text-right">p</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anovaRows.map((row) => (
                      <TableRow key={row.source}>
                        <TableCell className="font-medium">{row.source}</TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {formatDecimal(row.ss, 2)}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {row.df}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {row.ms !== null ? formatDecimal(row.ms, 2) : "—"}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {row.f !== null ? formatDecimal(row.f, 2) : "—"}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {row.p !== null ? formatPValue(row.p) : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end border-t border-border/60 p-2">
                  <CopyTableButton rows={copyRows} />
                </div>
              </div>
            </ResultsRegion>
          ) : (
            <ResultsPlaceholder
              title={
                invalidGroups
                  ? "Fix the highlighted groups"
                  : smallGroups.length > 0 && usable.length < 2
                    ? "Each group needs at least 2 values"
                    : "Enter at least 2 valid groups"
              }
              description="The full ANOVA table — SS, df, MS, F and p — appears here as soon as your groups are valid."
            />
          )}
        </div>
      </div>

      {result ? (
        <div className="overflow-x-auto rounded-2xl border border-primary/50 bg-card p-5 shadow-2xs">
          <p className="text-sm font-bold tracking-tight text-foreground">
            Group statistics
          </p>
          <Table className="mt-3">
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead className="text-right">n</TableHead>
                <TableHead className="text-right">Mean</TableHead>
                <TableHead className="text-right">SD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.groupStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">Group {index + 1}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{stat.n}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatDecimal(stat.mean, 2)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatDecimal(stat.sd, 2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium">Grand mean</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {formatDecimal(result.grandMean, 2)}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  )
}
