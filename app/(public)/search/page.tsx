import type { Metadata } from "next"
import { Suspense } from "react"

import { PageHeader } from "@/components/site/page-header"
import { SearchView } from "@/components/site/search-view"

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
}

export default function SearchPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <PageHeader
        title="Search"
        description="Find the Excel guide you need."
      />
      <div className="mt-8">
        <Suspense fallback={null}>
          <SearchView />
        </Suspense>
      </div>
    </div>
  )
}
