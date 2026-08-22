import { PageGuard } from "@/components/dashboard/page-guard"
import { UsersView } from "@/components/dashboard/users/users-view"

export default function UsersPage() {
  return (
    <PageGuard permission="users:manage" title="Users">
      <UsersView />
    </PageGuard>
  )
}
