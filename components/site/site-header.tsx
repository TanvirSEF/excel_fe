import Link from "next/link"
import Image from "next/image"

import { MainNav } from "@/components/site/main-nav"
import { MobileNav } from "@/components/site/mobile-nav"
import { SearchDialog } from "@/components/site/search-dialog"
import { getCategories } from "@/lib/api/categories"
import type { NavCategory } from "@/types/api"

export async function SiteHeader() {
  let navCategories: NavCategory[] = []

  try {
    const categories = await getCategories(600)
    navCategories = [...categories]
      .sort(
        (a, b) =>
          Number(b.is_featured) - Number(a.is_featured) ||
          a.order_index - b.order_index
      )
      .map((c) => ({ name: c.name, slug: c.slug, description: c.description }))
  } catch {
    navCategories = []
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70 shadow-2xs transition-all">
      <div className="mx-auto flex h-16 sm:h-[4.25rem] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Excel Insider Home"
          >
            <Image
              src="/logo-3x.png"
              alt="Excel Insider"
              width={185}
              height={48}
              priority
              className="h-10 sm:h-11 md:h-11.5 w-auto object-contain dark:brightness-110"
            />
          </Link>
        </div>

        <MainNav categories={navCategories} />

        <div className="flex items-center gap-2 sm:gap-3">
          <SearchDialog />

          <MobileNav categories={navCategories} />
        </div>
      </div>
    </header>
  )
}
