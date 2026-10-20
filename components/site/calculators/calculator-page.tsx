import type { ComponentType, ReactNode } from "react"

import { Breadcrumb } from "@/components/site/breadcrumb"
import { CalculatorArticle } from "@/components/site/calculators/calculator-article"
import { CalculatorRelatedSidebar } from "@/components/site/calculators/calculator-related-sidebar"
import type { CalculatorDetail } from "@/lib/calculator-content/types"

interface CalculatorGroupInfo {
  title: string
  icon: ComponentType<{ className?: string }>
  accent: string
}

export function CalculatorPage({
  category,
  group,
  entry,
  detail,
  relatedCalculators = [],
  children,
}: {
  category: { label: string; href: string }
  group: CalculatorGroupInfo
  entry: { name: string; whatItIs: string; whatToExpect: string }
  detail: CalculatorDetail
  relatedCalculators?: { slug: string; name: string; whatItIs: string }[]
  children: ReactNode
}) {
  const GroupIcon = group.icon

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculator/" },
          { label: category.label, href: category.href },
          { label: entry.name },
        ]}
      />

      <div className="mt-6 flex flex-col lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
        {/* Main Column */}
        <div className="min-w-0 flex-1 w-full max-w-4xl">
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${group.accent}`}
              >
                <GroupIcon className="h-[22px] w-[22px]" />
              </div>
              <span className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs sm:text-[13px] font-semibold text-primary">
                {group.title}
              </span>
            </div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {entry.name}
            </h1>
            <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {entry.whatItIs}
            </p>
            <div className="flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
              <p className="text-[15px] sm:text-base leading-relaxed text-foreground/90">
                {entry.whatToExpect}
              </p>
            </div>
          </header>

          <div className="mt-10">{children}</div>

          <CalculatorArticle detail={detail} />

          {/* Related tools list on mobile (below content) */}
          {relatedCalculators.length > 0 ? (
            <div className="mt-10 lg:hidden">
              <CalculatorRelatedSidebar
                calculators={relatedCalculators}
                categoryLabel={category.label}
                categoryHref={category.href}
              />
            </div>
          ) : null}
        </div>

        {/* Right Sidebar: 300px on desktop (Mediavine ad compatible) */}
        {relatedCalculators.length > 0 ? (
          <aside
            id="sidebar"
            aria-label="Sidebar"
            className="sidebar sidebar-primary elementor-widget-sidebar hidden lg:block w-[300px] shrink-0 space-y-6"
          >
            <CalculatorRelatedSidebar
              calculators={relatedCalculators}
              categoryLabel={category.label}
              categoryHref={category.href}
            />
          </aside>
        ) : null}
      </div>
    </div>
  )
}
