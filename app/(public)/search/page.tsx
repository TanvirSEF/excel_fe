import type { Metadata } from "next"

import { PageHeader } from "@/components/site/page-header"

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
}

export default function SearchPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <PageHeader title="Search" description="Not implemented yet." />
    </div>
  )
}
