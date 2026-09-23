import { PageGuard } from "@/components/dashboard/page-guard"
import { RolesView } from "@/components/dashboard/roles/roles-view"

export default function RolesPage() {
  return (
    <PageGuard permission="users:manage" title="Roles & Permissions">
      <RolesView />
    </PageGuard>
  )
}
