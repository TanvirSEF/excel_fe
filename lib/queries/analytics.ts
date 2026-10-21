import { useQuery } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import type {
  OverviewAnalytics,
  PostAnalytics,
  TrafficFeedResponse,
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
