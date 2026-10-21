import { AssistantInsightsView } from "@/components/dashboard/assistant/assistant-insights-view"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function AssistantPage() {
  return (
    <PageGuard permission="analytics:view" title="AI Assistant Insights">
      <AssistantInsightsView />
    </PageGuard>
  )
}
