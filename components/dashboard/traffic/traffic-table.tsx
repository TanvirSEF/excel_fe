"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconWorldSearch,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Time } from "@/components/shared/time"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TrafficLogItem } from "@/types/api"
import { CountryBadge } from "./country-flag"
import { DeviceBadge } from "./device-badge"

interface TrafficTableProps {
  items: TrafficLogItem[]
  page: number
  pageSize: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function formatReferrer(referrer?: string | null): { label: string; isSearch: boolean } {
  if (!referrer || !referrer.trim()) return { label: "Direct / None", isSearch: false }
  try {
    const url = new URL(referrer)
    const host = url.hostname.replace(/^www\./, "")
    if (host.includes("google.")) return { label: "Google", isSearch: true }
    if (host.includes("bing.")) return { label: "Bing", isSearch: true }
    if (host.includes("duckduckgo.")) return { label: "DuckDuckGo", isSearch: true }
    if (host.includes("yahoo.")) return { label: "Yahoo", isSearch: true }
    if (host.includes("facebook.") || host.includes("fb.")) return { label: "Facebook", isSearch: false }
    if (host.includes("twitter.") || host.includes("t.co") || host.includes("x.com")) {
      return { label: "X / Twitter", isSearch: false }
    }
    if (host.includes("linkedin.")) return { label: "LinkedIn", isSearch: false }
    return { label: host, isSearch: false }
  } catch {
    return { label: referrer.slice(0, 30), isSearch: false }
  }
}

export function TrafficTable({
  items,
  page,
  pageSize,
  totalPages,
  total,
  onPageChange,
  onPageSizeChange,
}: TrafficTableProps) {
  const [copiedIp, setCopiedIp] = useState<string | null>(null)

  const copyToClipboard = (ip: string) => {
    navigator.clipboard.writeText(ip)
    setCopiedIp(ip)
    toast.success(`Copied IP: ${ip}`)
    setTimeout(() => setCopiedIp(null), 2000)
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <IconWorldSearch className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No traffic logs found
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          No visitor events match your current search or filter criteria. As readers visit published articles, live activity will stream here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-32">Time</TableHead>
              <TableHead className="min-w-56">Visited Article</TableHead>
              <TableHead className="w-48">Location</TableHead>
              <TableHead className="w-40">Client IP</TableHead>
              <TableHead className="w-48">Device & Browser</TableHead>
              <TableHead className="w-36">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const refInfo = formatReferrer(item.referrer)
              const cleanHref = item.post_slug.startsWith("/")
                ? item.post_slug
                : `/${item.post_slug}`

              return (
                <TableRow key={item.id} className="transition-colors">
                  {/* 1. Time */}
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    <Time date={item.viewed_at} variant="relative" />
                  </TableCell>

                  {/* 2. Visited Article */}
                  <TableCell>
                    <div className="flex flex-col min-w-0 max-w-sm">
                      <Link
                        href={cleanHref}
                        target="_blank"
                        className="group flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors text-xs leading-snug truncate"
                        title={item.post_title}
                      >
                        <span className="truncate">{item.post_title}</span>
                        <IconExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <span className="font-mono text-[10px] text-muted-foreground truncate">
                        {cleanHref}
                      </span>
                    </div>
                  </TableCell>

                  {/* 3. Location */}
                  <TableCell>
                    <CountryBadge
                      code={item.country_code}
                      country={item.country}
                      city={item.city}
                    />
                  </TableCell>

                  {/* 4. Client IP */}
                  <TableCell>
                    {item.ip_address ? (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.ip_address!)}
                        className="group inline-flex items-center gap-1.5 rounded-md border border-input/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-foreground transition-colors hover:bg-muted hover:border-primary/40 cursor-pointer"
                        title="Click to copy IP"
                      >
                        <span>{item.ip_address}</span>
                        {copiedIp === item.ip_address ? (
                          <IconCheck className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <IconCopy className="h-3 w-3 text-muted-foreground opacity-50 group-hover:opacity-100" />
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground/60">—</span>
                    )}
                  </TableCell>

                  {/* 5. Device & Browser */}
                  <TableCell>
                    <DeviceBadge
                      deviceType={item.device_type}
                      browser={item.browser}
                      os={item.os}
                    />
                  </TableCell>

                  {/* 6. Source / Referrer */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        refInfo.isSearch
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          : refInfo.label.includes("Direct")
                            ? "bg-muted text-muted-foreground"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}
                      title={item.referrer || "Direct visit"}
                    >
                      {refInfo.label}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground cursor-pointer"
          >
            {[10, 25, 50, 100].map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total.toLocaleString()} visitors
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="px-2 font-medium text-foreground">
            Page {page} of {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
