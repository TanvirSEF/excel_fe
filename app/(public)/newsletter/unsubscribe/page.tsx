import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Newsletter unsubscribe",
  robots: { index: false },
}

export default function NewsletterUnsubscribePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Unsubscribe
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Not implemented yet.
      </p>
    </div>
  )
}
