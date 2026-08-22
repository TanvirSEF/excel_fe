import { useQuery } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import type { OverviewAnalytics, PostAnalytics } from "@/types/api"

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
