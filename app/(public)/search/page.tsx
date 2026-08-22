import type { Metadata } from "next"

import { PageHeader } from "@/components/site/page-header"
import { SearchView } from "@/components/site/search-view"

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams
  const query = q ?? ""
  const pageNumber = Math.max(1, Number(page ?? "1") || 1)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <PageHeader
        title="Search"
        description="Find the Excel guide you need."
      />
      <div className="mt-8">
        <SearchView query={query} page={pageNumber} />
      </div>
    </div>
  )
}
