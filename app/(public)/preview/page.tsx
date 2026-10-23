import type { Metadata } from "next"
import { Suspense } from "react"

import { LiveArticlePreview } from "@/components/site/live-article-preview"

export const metadata: Metadata = {
  title: "Live Preview | Excel Insider",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted/20" />}>
      <LiveArticlePreview />
    </Suspense>
  )
}
