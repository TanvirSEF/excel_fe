import type { Metadata } from "next"

import { PageHeader } from "@/components/site/page-header"

export const metadata: Metadata = {
  title: "Newsletter unsubscribe",
  robots: { index: false },
}

export default function NewsletterUnsubscribePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <PageHeader
        title="Unsubscribe"
        description="Not implemented yet."
      />
    </div>
  )
}
