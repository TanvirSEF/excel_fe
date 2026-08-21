import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function AuditLogsPage() {
  return (
    <PageGuard permission="audit:view" title="Audit logs">
      <ComingSoon title="Audit logs" />
    </PageGuard>
  )
}
