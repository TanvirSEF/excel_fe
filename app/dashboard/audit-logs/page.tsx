import { AuditLogsView } from "@/components/dashboard/audit/audit-logs-view"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function AuditLogsPage() {
  return (
    <PageGuard permission="audit:view" title="Audit logs">
      <AuditLogsView />
    </PageGuard>
  )
}
