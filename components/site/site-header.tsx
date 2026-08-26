import Link from "next/link"
import Image from "next/image"

import { MainNav } from "@/components/site/main-nav"
import { MobileNav } from "@/components/site/mobile-nav"
import { SearchDialog } from "@/components/site/search-dialog"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-2xs transition-all">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Excel Insider Home"
          >
            <Image
              src="/logo.png"
              alt="Excel Insider"
              width={160}
              height={42}
              priority
              className="h-9 w-auto object-contain dark:brightness-110"
            />
          </Link>
        </div>

        <MainNav />

        <div className="flex items-center gap-2 sm:gap-3">
          <SearchDialog />

          <div className="hidden sm:flex items-center gap-2 border-l border-border/60 pl-3">
            <Button
              asChild
              size="sm"
              className="hidden xl:inline-flex rounded-full font-medium shadow-xs text-xs px-4 h-8.5 transition-all hover:shadow-sm"
            >
              <Link href="/pricing">Free Templates</Link>
            </Button>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  )
}
