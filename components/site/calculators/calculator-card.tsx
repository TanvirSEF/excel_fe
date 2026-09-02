import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"

import type { CalculatorDefinition } from "@/lib/calculators"
import { cn } from "@/lib/utils"

interface CalculatorCardProps {
  calculator: CalculatorDefinition
  variant?: "compact" | "default"
}

export function CalculatorCard({
  calculator,
  variant = "default",
}: CalculatorCardProps) {
  const Icon = calculator.icon

  return (
    <Link
      href={`/calculators/${calculator.slug}`}
      className={cn(
        "group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg",
        variant === "compact" ? "p-5" : "p-6"
      )}
    >
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "flex items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
              variant === "compact" ? "h-10 w-10" : "h-11 w-11"
            )}
          >
            <Icon className={variant === "compact" ? "h-5 w-5" : "h-[22px] w-[22px]"} />
          </div>
          <span className="rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {calculator.badge}
          </span>
        </div>

        <h3
          className={cn(
            "font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary",
            variant === "compact" ? "text-base" : "text-lg"
          )}
        >
          {calculator.shortTitle}
        </h3>

        <p className="text-xs leading-relaxed text-muted-foreground">
          {calculator.description}
        </p>

        <div className="flex items-baseline gap-1.5 overflow-hidden rounded-lg border border-border/70 bg-muted/40 px-3 py-2 font-mono text-[11px] text-foreground/80 transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
          <span className="shrink-0 font-semibold text-primary">fx</span>
          <span className="min-w-0 flex-1 truncate">{calculator.formulaSnippet}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
        <span>Launch tool</span>
        <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  )
}
