import { ChatWidget } from "@/components/site/ai-assistant/chat-widget"
import { MediavineTag } from "@/components/site/mediavine-tag"
import { MediavineRouteListener } from "@/components/site/mediavine-route-listener"
import { SiteAnalyticsTracker } from "@/components/site/site-analytics-tracker"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { config } from "@/lib/config"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <ChatWidget />
      <MediavineTag tagId={config.mediavineTagId} />
      <MediavineRouteListener />
      <SiteAnalyticsTracker />
    </div>
  )
}
