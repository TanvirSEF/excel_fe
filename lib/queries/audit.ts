import { useQuery } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import type { AuditLog, Page } from "@/types/api"

export interface AuditLogsParams {
  user_id?: string
  entity_type?: string
  action?: string
  page?: number
}

export function useAuditLogs(params: AuditLogsParams = {}) {
  return useQuery({
    queryKey: [
      "audit-logs",
      {
        user_id: params.user_id,
        entity_type: params.entity_type,
        action: params.action,
        page: params.page,
      },
    ],
    queryFn: () =>
      apiFetch<Page<AuditLog>>("/audit-logs", {
        searchParams: {
          user_id: params.user_id,
          entity_type: params.entity_type,
          action: params.action,
          page: params.page,
          page_size: 15,
        },
      }),
  })
}
