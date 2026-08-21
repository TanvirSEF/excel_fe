import { MediaView } from "@/components/dashboard/media/media-view"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function MediaPage() {
  return (
    <PageGuard permission="media:view" title="Media">
      <MediaView />
    </PageGuard>
  )
}
