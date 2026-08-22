import { PageGuard } from "@/components/dashboard/page-guard"
import { SettingsView } from "@/components/dashboard/settings/settings-view"

export default function SettingsPage() {
  return (
    <PageGuard permission="settings:view" title="Settings">
      <SettingsView />
    </PageGuard>
  )
}
