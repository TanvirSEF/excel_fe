import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Excel Insider — Excel formulas, tips &amp; deep dives.
        </p>
        <nav
          className="flex items-center gap-4 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          <Link href="/blog" className="transition-colors hover:text-foreground">
            Blog
          </Link>
          <Link
            href="/categories"
            className="transition-colors hover:text-foreground"
          >
            Categories
          </Link>
        </nav>
      </div>
    </footer>
  )
}
