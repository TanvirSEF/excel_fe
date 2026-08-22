"use client"

import { useState } from "react"

import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Time } from "@/components/shared/time"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useAuditLogs } from "@/lib/queries/audit"
import type { AuditLog } from "@/types/api"

const ENTITY_PREFIX_STYLES: Record<string, string> = {
  post: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  user: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  comment: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  media: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  category: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
}

export function AuditLogsView() {
  const [page, setPage] = useState(1)
  const [entityType, setEntityType] = useState("")
  const [action, setAction] = useState("")
  const [applied, setApplied] = useState({ entityType: "", action: "" })
  const [expanded, setExpanded] = useState<number | null>(null)

  const { data, isPending, isError, refetch } = useAuditLogs({
    entity_type: applied.entityType || undefined,
    action: applied.action || undefined,
    page,
  })

  const items = data?.items ?? []
  const totalPages = data?.total_pages ?? 1

  function applyFilters() {
    setPage(1)
    setApplied({ entityType: entityType.trim(), action: action.trim() })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Who changed what, when.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          value={entityType}
          onChange={(event) => setEntityType(event.target.value)}
          placeholder="Entity type (e.g. post)"
          className="h-8 w-44 text-xs"
        />
        <Input
          value={action}
          onChange={(event) => setAction(event.target.value)}
          placeholder="Action (e.g. post.published)"
          className="h-8 w-44 text-xs"
        />
        <Button type="button" variant="outline" size="sm" onClick={applyFilters}>
          Filter
        </Button>
        {applied.entityType || applied.action ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setEntityType("")
              setAction("")
              setApplied({ entityType: "", action: "" })
              setPage(1)
            }}
          >
            Clear
          </Button>
        ) : null}
      </div>

      {isError ? (
        <ErrorState
          title="Could not load audit logs"
          message="The audit service did not respond. Try again."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No audit entries"
          description="Actions like publishing, role changes and deletes appear here."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">When</th>
                <th className="px-4 py-2.5 font-medium">Actor</th>
                <th className="px-4 py-2.5 font-medium">Action</th>
                <th className="px-4 py-2.5 font-medium">Entity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((log) => (
                <AuditRow
                  key={log.id}
                  log={log}
                  expanded={expanded === log.id}
                  onToggle={() =>
                    setExpanded((current) => (current === log.id ? null : log.id))
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function AuditRow({
  log,
  expanded,
  onToggle,
}: {
  log: AuditLog
  expanded: boolean
  onToggle: () => void
}) {
  const prefix = log.action.split(".")[0] ?? ""
  const badgeStyle = ENTITY_PREFIX_STYLES[prefix] ?? "bg-secondary text-secondary-foreground"

  return (
    <>
      <tr
        className={cn(
          "cursor-pointer border-b last:border-b-0 transition-colors hover:bg-accent/40",
          expanded && "bg-accent/30"
        )}
        onClick={onToggle}
      >
        <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
          <Time date={log.created_at} variant="full" />
        </td>
        <td className="px-4 py-2.5">{log.actor_name ?? "system"}</td>
        <td className="px-4 py-2.5">
          <span
            className={cn("rounded-full px-2 py-0.5 text-xs font-normal", badgeStyle)}
          >
            {log.action}
          </span>
        </td>
        <td className="px-4 py-2.5 text-xs text-muted-foreground">
          {log.entity_type}
          {log.entity_id ? ` · ${log.entity_id.slice(0, 8)}…` : ""}
        </td>
      </tr>
      {expanded && log.metadata ? (
        <tr className="border-b last:border-b-0 bg-muted/20">
          <td colSpan={4} className="px-4 py-3">
            <pre className="max-h-48 overflow-auto rounded-md bg-muted/50 p-3 text-xs">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </td>
        </tr>
      ) : null}
    </>
  )
}
