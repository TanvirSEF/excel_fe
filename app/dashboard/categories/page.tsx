import { CategoriesView } from "@/components/dashboard/categories/categories-view"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function CategoriesPage() {
  return (
    <PageGuard permission="categories:manage" title="Categories">
      <CategoriesView />
    </PageGuard>
  )
}
