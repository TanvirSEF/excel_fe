import Link from "next/link"
import { IconCalculator, IconArrowRight, IconChevronRight } from "@tabler/icons-react"

interface CalculatorRelatedSidebarProps {
  calculators: {
    slug: string
    name: string
    whatItIs: string
  }[]
  categoryLabel: string
  categoryHref: string
}

export function CalculatorRelatedSidebar({
  calculators,
  categoryLabel,
  categoryHref,
}: CalculatorRelatedSidebarProps) {
  if (!calculators || calculators.length === 0) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
      {/* Themed Header */}
      <div className="bg-primary px-4 py-3.5 text-primary-foreground">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-primary-foreground backdrop-blur-xs">
              <IconCalculator className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold tracking-tight text-primary-foreground">
              Related Calculators
            </h2>
          </div>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold tracking-tight text-primary-foreground backdrop-blur-xs">
            {calculators.length} tools
          </span>
        </div>
        <p className="mt-2 text-[13px] text-primary-foreground/85">
          More from{" "}
          <Link
            href={categoryHref}
            className="inline-flex items-center gap-1 font-semibold text-primary-foreground underline decoration-white/40 underline-offset-2 transition-colors hover:decoration-white hover:text-white"
          >
            <span>{categoryLabel}</span>
            <IconArrowRight className="h-3 w-3 inline" />
          </Link>
        </p>
      </div>

      {/* 5 Items List */}
      <ul className="divide-y divide-border/60">
        {calculators.map((calc) => (
          <li key={calc.slug}>
            <Link
              href={`${categoryHref}${calc.slug}/`}
              className="group flex items-start gap-3 p-3.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground mt-0.5">
                <IconCalculator className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {calc.name}
                  </h3>
                  <IconChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                  {calc.whatItIs}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
