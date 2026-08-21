import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function UsersPage() {
  return (
    <PageGuard permission="users:manage" title="Users">
      <ComingSoon title="Users" />
    </PageGuard>
  )
}
