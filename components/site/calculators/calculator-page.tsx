import type { ComponentType, ReactNode } from "react"

import { Breadcrumb } from "@/components/site/breadcrumb"
import { CalculatorArticle } from "@/components/site/calculators/calculator-article"
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
  children,
}: {
  category: { label: string; href: string }
  group: CalculatorGroupInfo
  entry: { name: string; whatItIs: string; whatToExpect: string }
  detail: CalculatorDetail
  children: ReactNode
}) {
  const GroupIcon = group.icon

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators" },
          { label: category.label, href: category.href },
          { label: entry.name },
        ]}
      />

      <header className="mt-6 max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${group.accent}`}
          >
            <GroupIcon className="h-[22px] w-[22px]" />
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
            {group.title}
          </span>
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {entry.name}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {entry.whatItIs}
        </p>
        <div className="flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
          <p className="text-sm leading-relaxed text-foreground/85">
            {entry.whatToExpect}
          </p>
        </div>
      </header>

      <div className="mt-10">{children}</div>

      <CalculatorArticle detail={detail} />
    </div>
  )
}
