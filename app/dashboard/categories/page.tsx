import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function CategoriesPage() {
  return (
    <PageGuard permission="categories:manage" title="Categories">
      <ComingSoon title="Categories" />
    </PageGuard>
  )
}
