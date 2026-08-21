import { PageGuard } from "@/components/dashboard/page-guard"
import { EditorView } from "@/components/editor/editor-view"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params

  return (
    <PageGuard permission="posts:view" title="Edit post">
      <EditorView postId={id} />
    </PageGuard>
  )
}
