import { PageGuard } from "@/components/dashboard/page-guard"
import { TagsView } from "@/components/dashboard/tags/tags-view"

export default function TagsPage() {
  return (
    <PageGuard permission="tags:view" title="Tags">
      <TagsView />
    </PageGuard>
  )
}
