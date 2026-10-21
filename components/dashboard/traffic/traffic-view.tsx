"use client"

import { useState } from "react"
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconRefresh,
  IconSearch,
  IconX,
} from "@tabler/icons-react"

import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useTrafficFeed } from "@/lib/queries/analytics"
import { TrafficKpiCards } from "./traffic-kpi-cards"
import { TrafficTable } from "./traffic-table"

const DEVICE_OPTIONS = [
  { value: "", label: "All Devices" },
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
  { value: "tablet", label: "Tablet" },
]

export function TrafficView() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [deviceType, setDeviceType] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [search, setSearch] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(true)

  const { data, isPending, isError, isFetching, refetch } = useTrafficFeed({
    page,
    pageSize,
    deviceType,
    countryCode,
    search,
    autoRefresh,
  })

  const handleResetFilters = () => {
    setDeviceType("")
    setCountryCode("")
    setSearch("")
    setPage(1)
  }

  const hasActiveFilters = Boolean(deviceType || countryCode || search)

  return (
    <div className="space-y-6">
      {/* Header with live control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Live Traffic & Real-Time Visitors
            </h1>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                autoRefresh
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {autoRefresh ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Stream
                </>
              ) : (
                "Paused"
              )}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor real-time reader requests, geographic locations, and devices across all published Excel guides.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-1.5 text-xs"
          >
            {autoRefresh ? (
              <>
                <IconPlayerPause className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Pause stream</span>
              </>
            ) : (
              <>
                <IconPlayerPlay className="h-3.5 w-3.5 text-emerald-500" />
                <span>Resume stream</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 text-xs"
            title="Refresh now"
          >
            <IconRefresh
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-primary" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Real-time KPI summary cards */}
      <TrafficKpiCards stats={data?.stats} isLive={autoRefresh} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-xs">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-48">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search post title, URL, or client IP..."
              className="h-9 pl-8 text-xs"
            />
          </div>

          {/* Device Filter */}
          <select
            value={deviceType}
            onChange={(e) => {
              setDeviceType(e.target.value)
              setPage(1)
            }}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground cursor-pointer"
          >
            {DEVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Country Code Filter */}
          <Input
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value.toUpperCase())
              setPage(1)
            }}
            placeholder="Country (e.g. US, BD, GB)"
            className="h-9 w-28 uppercase font-mono text-xs"
            maxLength={2}
          />
        </div>

        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-9 gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            <IconX className="h-3.5 w-3.5" />
            <span>Reset filters</span>
          </Button>
        ) : null}
      </div>

      {/* Table Content */}
      {isError ? (
        <ErrorState
          title="Could not load live traffic"
          message="The analytics service did not respond. Check connection and retry."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : isPending && !data ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : (
        <TrafficTable
          items={data?.items || []}
          page={data?.page || 1}
          pageSize={data?.page_size || 25}
          totalPages={data?.total_pages || 1}
          total={data?.total || 0}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setPage(1)
          }}
        />
      )}
    </div>
  )
}
