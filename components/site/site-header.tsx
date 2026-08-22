import Link from "next/link"

import { NavLink } from "@/components/site/nav-link"
import { ThemeToggle } from "@/components/shared/theme-toggle"

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/categories", label: "Categories" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Excel Insider
        </Link>

        <div className="flex items-center gap-4">
          <form action="/search" className="hidden md:block">
            <input
              type="search"
              name="q"
              placeholder="Search…"
              minLength={2}
              aria-label="Search articles"
              className="h-8 w-36 rounded-md border border-input bg-background px-3 text-sm transition-all focus:w-52 focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </form>

          <nav className="flex items-center gap-1" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
