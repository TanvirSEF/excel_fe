import { ChatWidget } from "@/components/site/ai-assistant/chat-widget"
import { MediavineRouteListener } from "@/components/site/mediavine-route-listener"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

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
      <MediavineRouteListener />
    </div>
  )
}
