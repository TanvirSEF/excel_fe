import { useQuery } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import type {
  OverviewAnalytics,
  PostAnalytics,
  BreakdownDimension,
  BreakdownReport,
  EventsReport,
  OverviewReport,
  PagesReport,
  QualityReport,
  RealtimeAnalytics,
  SessionsReport,
  TrafficFeedResponse,
  TrafficFilter,
} from "@/types/api"

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => apiFetch<OverviewAnalytics>("/analytics/overview"),
  })
}

export function usePostAnalytics(postId: string | undefined) {
  return useQuery({
    queryKey: ["analytics", "post", postId],
    enabled: Boolean(postId),
    queryFn: () => apiFetch<PostAnalytics>(`/analytics/posts/${postId}`),
  })
}

export interface TrafficFeedParams {
  page?: number
  pageSize?: number
  countryCode?: string
  deviceType?: string
  search?: string
  autoRefresh?: boolean
}

export function useTrafficFeed(params: TrafficFeedParams = {}) {
  const {
    page = 1,
    pageSize = 25,
    countryCode,
    deviceType,
    search,
    autoRefresh = false,
  } = params

  return useQuery({
    queryKey: [
      "analytics",
      "traffic",
      { page, pageSize, countryCode, deviceType, search },
    ],
    queryFn: () =>
      apiFetch<TrafficFeedResponse>("/analytics/traffic", {
        searchParams: {
          page,
          page_size: pageSize,
          country_code: countryCode || undefined,
          device_type: deviceType || undefined,
          search: search || undefined,
        },
      }),
    refetchInterval: autoRefresh ? 6000 : false,
  })
}

export interface AssistantAnalyticsResponse {
  total_queries: number
  queries_today: number
  satisfaction_rate: number
  match_rate: number
  thumbs_up: number
  thumbs_down: number
  content_gaps: Array<{
    id: string
    query_text: string
    created_at: string | null
  }>
  recent_queries: Array<{
    id: string
    query_text: string
    matched_articles_count: number
    matched_calculators_count: number
    user_feedback: "up" | "down" | null
    created_at: string | null
  }>
}

export function useAssistantAnalytics() {
  return useQuery({
    queryKey: ["analytics", "assistant"],
    queryFn: () => apiFetch<AssistantAnalyticsResponse>("/analytics/assistant"),
    refetchInterval: 30_000,
  })
}

export interface ReportParams {
  from: string
  to: string
  tz: string
  traffic: TrafficFilter
  compare: boolean
}

function reportSearchParams(params: ReportParams) {
  return {
    from: params.from,
    to: params.to,
    tz: params.tz,
    traffic: params.traffic,
    compare: params.compare,
  }
}

export function useRealtimeAnalytics() {
  return useQuery({
    queryKey: ["analytics", "realtime"],
    queryFn: () => apiFetch<RealtimeAnalytics>("/analytics/realtime"),
    refetchInterval: 10_000,
  })
}

export function useOverviewReport(params: ReportParams) {
  return useQuery({
    queryKey: ["analytics", "report", "overview", params],
    queryFn: () =>
      apiFetch<OverviewReport>("/analytics/reports/overview", {
        searchParams: reportSearchParams(params),
      }),
  })
}

export function useBreakdownReport(
  dimension: BreakdownDimension,
  params: ReportParams,
  limit = 10
) {
  return useQuery({
    queryKey: ["analytics", "report", "breakdown", dimension, limit, params],
    queryFn: () =>
      apiFetch<BreakdownReport>("/analytics/reports/breakdown", {
        searchParams: { ...reportSearchParams(params), dimension, limit },
      }),
  })
}

export function usePagesReport(params: ReportParams, page: number) {
  return useQuery({
    queryKey: ["analytics", "report", "pages", page, params],
    queryFn: () =>
      apiFetch<PagesReport>("/analytics/reports/pages", {
        searchParams: { ...reportSearchParams(params), page, page_size: 15 },
      }),
  })
}

export function useQualityReport(params: ReportParams) {
  return useQuery({
    queryKey: ["analytics", "report", "quality", params],
    queryFn: () =>
      apiFetch<QualityReport>("/analytics/reports/quality", {
        searchParams: reportSearchParams(params),
      }),
  })
}

export function useSessionsReport(params: ReportParams, page: number) {
  return useQuery({
    queryKey: ["analytics", "report", "sessions", page, params],
    queryFn: () =>
      apiFetch<SessionsReport>("/analytics/reports/sessions", {
        searchParams: { ...reportSearchParams(params), page, page_size: 15 },
      }),
  })
}

export function useEventsReport(params: ReportParams) {
  return useQuery({
    queryKey: ["analytics", "report", "events", params],
    queryFn: () =>
      apiFetch<EventsReport>("/analytics/reports/events", {
        searchParams: reportSearchParams(params),
      }),
  })
}
