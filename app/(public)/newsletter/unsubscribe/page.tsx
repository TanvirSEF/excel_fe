import type { Metadata } from "next"

import { PageHeader } from "@/components/site/page-header"
import { UnsubscribeView } from "@/components/site/newsletter/unsubscribe-view"

export const metadata: Metadata = {
  title: "Newsletter unsubscribe",
  robots: { index: false },
}

interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function NewsletterUnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const { token } = await searchParams

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
      <PageHeader
        title="Unsubscribe"
        description="One click and the newsletter stops."
      />
      <div className="mt-6">
        {token ? (
          <UnsubscribeView token={token} />
        ) : (
          <p className="text-sm text-destructive">
            This unsubscribe link is invalid — it&apos;s missing its token.
          </p>
        )}
      </div>
    </div>
  )
}
