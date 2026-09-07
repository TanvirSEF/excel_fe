"use client"

import { useMemo, useState } from "react"
import {
  IconAlertTriangle,
  IconMinus,
  IconPlus,
  IconRotate,
} from "@tabler/icons-react"

import { CopyTableButton } from "@/components/site/calculators/copy-table-button"
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
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDecimal, formatPValue } from "@/lib/format"
import {
  parseDataSet,
  twoWayAnova,
  twoWayAnovaReplicated,
  type TwoWayAnovaReplicatedResult,
} from "@/lib/stats"

interface AnovaTableRow {
  source: string
  ss: number
  df: number
  ms: number | null
  f: number | null
  p: number | null
}

const DEFAULT_CELLS = [
  ["8", "10", "12"],
  ["10", "12", "14"],
  ["12", "14", "22"],
]

function resizeGrid(cells: string[][], rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => cells[i]?.[j] ?? "")
  )
}

export function TwoWayAnovaCalculator() {
  const [cells, setCells] = useState<string[][]>(DEFAULT_CELLS)
  const rows = cells.length
  const cols = cells[0]?.length ?? 0

  function setCell(i: number, j: number, value: string) {
    setCells((current) =>
      current.map((row, ri) =>
        ri === i ? row.map((cell, ci) => (ci === j ? value : cell)) : row
      )
    )
  }

  const analysis = useMemo(() => {
    const parsed = cells.map((row) => row.map((cell) => parseDataSet(cell)))
    const hasInvalid = parsed.some((row) =>
      row.some((cell) => cell.invalid.length > 0)
    )
    if (hasInvalid) return { error: "Some cells contain non-numeric values." }

    const counts = parsed.flat().map((cell) => cell.values.length)
    const allFilled = counts.every((n) => n > 0)
    if (!allFilled) return { error: "Fill every cell with at least one value." }

    const uniqueCounts = new Set(counts)
    if (uniqueCounts.size > 1) {
      return {
        error:
          "Enter either exactly 1 value in every cell (unreplicated) or the same count of 2+ values in every cell (replicated).",
      }
    }

    const n = counts[0]
    if (n === 1) {
      const matrix = parsed.map((row) => row.map((cell) => cell.values[0]))
      const result = twoWayAnova(matrix)
      return result
        ? { result, replicated: false as const }
        : { error: "The grid needs at least 2 rows and 2 columns." }
    }

    const cube = parsed.map((row) => row.map((cell) => cell.values))
    const result = twoWayAnovaReplicated(cube)
    return result
      ? { result, replicated: true as const }
      : { error: "Replication needs 2+ values in every cell." }
  }, [cells])

  const result = "result" in analysis ? analysis.result : null
  const replicated = "replicated" in analysis ? analysis.replicated : false
  const error = "error" in analysis ? analysis.error : null

  const anovaRows: AnovaTableRow[] = (() => {
    if (!result) return []
    const base: AnovaTableRow[] = [
      {
        source: "Rows (factor A)",
        ss: result.ssRows,
        df: result.dfRows,
        ms: result.msRows,
        f: result.fRows,
        p: result.pRows,
      },
      {
        source: "Columns (factor B)",
        ss: result.ssCols,
        df: result.dfCols,
        ms: result.msCols,
        f: result.fCols,
        p: result.pCols,
      },
    ]
    if (replicated && "ssInteraction" in result) {
      const full = result as TwoWayAnovaReplicatedResult
      base.push({
        source: "Interaction (A×B)",
        ss: full.ssInteraction,
        df: full.dfInteraction,
        ms: full.msInteraction,
        f: full.fInteraction,
        p: full.pInteraction,
      })
    }
    base.push({
      source: "Error",
      ss: result.ssError,
      df: result.dfError,
      ms: result.msError,
      f: null,
      p: null,
    })
    base.push({
      source: "Total",
      ss: result.ssRows + result.ssCols + result.ssError + (replicated && "ssInteraction" in result ? (result as TwoWayAnovaReplicatedResult).ssInteraction : 0),
      df: result.dfRows + result.dfCols + result.dfError + (replicated && "ssInteraction" in result ? (result as TwoWayAnovaReplicatedResult).dfInteraction : 0),
      ms: null,
      f: null,
      p: null,
    })
    return base
  })()

  const copyRows: string[][] = result
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
            <CardTitle>Data grid</CardTitle>
            <CardDescription>
              One value per cell = unreplicated. Same 2+ values per cell = replicated
              with interaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={rows <= 2}
                  onClick={() => setCells((c) => resizeGrid(c, rows - 1, cols))}
                  aria-label="Remove row"
                >
                  <IconMinus className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-medium text-muted-foreground">
                  {rows} rows
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={rows >= 6}
                  onClick={() => setCells((c) => resizeGrid(c, rows + 1, cols))}
                  aria-label="Add row"
                >
                  <IconPlus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={cols <= 2}
                  onClick={() => setCells((c) => resizeGrid(c, rows, cols - 1))}
                  aria-label="Remove column"
                >
                  <IconMinus className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-medium text-muted-foreground">
                  {cols} cols
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={cols >= 6}
                  onClick={() => setCells((c) => resizeGrid(c, rows, cols + 1))}
                  aria-label="Add column"
                >
                  <IconPlus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="w-14" />
                    {Array.from({ length: cols }, (_, j) => (
                      <th key={j} className="pb-1 text-[11px] font-medium text-muted-foreground">
                        B{j + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cells.map((row, i) => (
                    <tr key={i}>
                      <td className="pr-1 text-right text-[11px] font-medium text-muted-foreground">
                        A{i + 1}
                      </td>
                      {row.map((cell, j) => (
                        <td key={j}>
                          <Input
                            value={cell}
                            onChange={(event) => setCell(i, j, event.target.value)}
                            placeholder="value"
                            spellCheck={false}
                            className="h-9 bg-background text-center font-mono text-xs tabular-nums"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setCells(DEFAULT_CELLS)}
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
                label="F (rows / factor A)"
                value={formatDecimal(result.fRows, 2)}
                sub={`p = ${formatPValue(result.pRows)} · df (${result.dfRows}, ${result.dfError})`}
              />

              {!replicated ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-xs leading-relaxed text-blue-700 dark:text-blue-400">
                  <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Unreplicated model — like Excel&apos;s “Two-Factor Without
                    Replication”. With one value per cell, the interaction effect
                    cannot be separated from error. Put the same 2+ values in every
                    cell to test the interaction.
                  </p>
                </div>
              ) : null}

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
                        <TableCell className="text-right font-mono tabular-nums">{row.df}</TableCell>
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
              title={error ?? "Enter your grid"}
              description="Rows test factor A, columns test factor B — the full ANOVA table appears once every cell is valid."
            />
          )}
        </div>
      </div>

      {result ? (
        <div className="overflow-x-auto rounded-2xl border border-primary/50 bg-card p-5 shadow-2xs">
          <p className="text-sm font-bold tracking-tight text-foreground">
            Row &amp; column means
          </p>
          <Table className="mt-3">
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Mean</TableHead>
                <TableHead className="text-right">vs grand mean</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.rowMeans.map((m, i) => (
                <TableRow key={`row-${i}`}>
                  <TableCell className="font-medium">A{i + 1} (row)</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatDecimal(m, 2)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatDecimal(m - result.grandMean, 2)}
                  </TableCell>
                </TableRow>
              ))}
              {result.colMeans.map((m, j) => (
                <TableRow key={`col-${j}`}>
                  <TableCell className="font-medium">B{j + 1} (column)</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatDecimal(m, 2)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatDecimal(m - result.grandMean, 2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium">Grand mean</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {formatDecimal(result.grandMean, 2)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  )
}
