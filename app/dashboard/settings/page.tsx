import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function SettingsPage() {
  return (
    <PageGuard permission="settings:view" title="Settings">
      <ComingSoon title="Settings" />
    </PageGuard>
  )
}
