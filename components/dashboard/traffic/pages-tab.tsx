"use client"

import { useState } from "react"

import { BreakdownCard } from "@/components/dashboard/traffic/breakdown-card"
import { ReportPager } from "@/components/dashboard/traffic/report-pager"
import { ErrorState } from "@/components/shared/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDuration, formatRate } from "@/lib/analytics-format"
import { usePagesReport, type ReportParams } from "@/lib/queries/analytics"

export function PagesTab({ params }: { params: ReportParams }) {
  const [page, setPage] = useState(1)
  const { data, isPending, isError } = usePagesReport(params, page)

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">Pages and screens</h2>
        <p className="text-sm text-muted-foreground">
          Exit rate is the share of a page&apos;s views that ended a session.
        </p>
        {isError ? (
          <ErrorState title="Could not load pages" message="Try refreshing in a moment." />
        ) : isPending || !data ? (
          <Skeleton className="h-72 w-full rounded-2xl" />
        ) : (
          <div className="rounded-2xl border bg-card p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Users</TableHead>
                  <TableHead className="text-right">Avg. engaged</TableHead>
                  <TableHead className="text-right">Avg. scroll</TableHead>
                  <TableHead className="text-right">Exit rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No pageviews in this period.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.rows.map((row) => (
                    <TableRow key={row.path}>
                      <TableCell className="max-w-xs truncate font-medium">{row.path}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.views.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.users.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatDuration(row.avg_engaged_seconds)}</TableCell>
                      <TableCell className="text-right tabular-nums">{Math.round(row.avg_scroll)}%</TableCell>
                      <TableCell className="text-right tabular-nums">{formatRate(row.exit_rate)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <ReportPager page={data.page} pageSize={data.page_size} total={data.total} onPageChange={setPage} />
          </div>
        )}
      </section>

      <BreakdownCard
        title="Landing pages"
        description="Where sessions start, with engagement per landing page"
        dimension="landing"
        params={params}
        limit={15}
      />
    </div>
  )
}
