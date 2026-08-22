import { AnalyticsView } from "@/components/dashboard/analytics/analytics-view"
import { PageGuard } from "@/components/dashboard/page-guard"

interface AnalyticsPageProps {
  searchParams: Promise<{ post?: string }>
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const { post } = await searchParams

  return (
    <PageGuard permission="analytics:view" title="Analytics">
      <AnalyticsView postId={post} />
    </PageGuard>
  )
}
