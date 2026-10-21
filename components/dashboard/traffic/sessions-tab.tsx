"use client"

import { useState } from "react"

import { ReportPager } from "@/components/dashboard/traffic/report-pager"
import { CLASS_LABELS } from "@/components/dashboard/traffic/quality-tab"
import { ErrorState } from "@/components/shared/error-state"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDuration } from "@/lib/analytics-format"
import { useSessionsReport, type ReportParams } from "@/lib/queries/analytics"

export function SessionsTab({ params }: { params: ReportParams }) {
  const [page, setPage] = useState(1)
  const { data, isPending, isError } = useSessionsReport(params, page)

  if (isError) return <ErrorState title="Could not load sessions" message="Try refreshing in a moment." />
  if (isPending || !data) return <Skeleton className="h-96 w-full rounded-2xl" />

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Session IDs are shortened one-way hashes. Duration shows a dash when the session is still active or has only
        one event, so it cannot be measured.
      </p>
      <div className="rounded-2xl border bg-card p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session</TableHead>
              <TableHead>Started</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Engaged</TableHead>
              <TableHead className="text-right">Pages</TableHead>
              <TableHead>Landing to exit</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Quality</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  No sessions in this period.
                </TableCell>
              </TableRow>
            ) : (
              data.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.id}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs">{new Date(row.started_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatDuration(row.duration_seconds)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatDuration(row.engaged_seconds)}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.pages}</TableCell>
                  <TableCell className="max-w-56 truncate text-xs" title={`${row.landing_path} to ${row.exit_path ?? ""}`}>
                    {row.landing_path}
                    {row.exit_path && row.exit_path !== row.landing_path ? ` → ${row.exit_path}` : ""}
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.source} / {row.medium}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" title={row.reason ?? undefined}>
                      {CLASS_LABELS[row.traffic_class] ?? row.traffic_class}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ReportPager page={data.page} pageSize={data.page_size} total={data.total} onPageChange={setPage} />
      </div>
    </div>
  )
}
