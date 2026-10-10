import { MediavineTag } from "@/components/site/mediavine-tag"
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
      <MediavineTag tagId={config.mediavineTagId} />
    </div>
  )
}
