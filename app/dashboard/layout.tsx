import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QueryProvider } from "@/components/query-provider"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <QueryProvider>
      <DashboardShell>{children}</DashboardShell>
    </QueryProvider>
  )
}
