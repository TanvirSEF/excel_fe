import { PageGuard } from "@/components/dashboard/page-guard"
import { EditorView } from "@/components/editor/editor-view"

export default function NewPostPage() {
  return (
    <PageGuard permission="posts:view" title="New post">
      <EditorView />
    </PageGuard>
  )
}
