import { IconCheck, IconSparkles } from "@tabler/icons-react"

import { RequestDialog } from "@/components/site/pricing/request-dialog"
import type { PaidPlan } from "@/lib/pricing"
import { cn } from "@/lib/utils"

export function PricingPlanCard({ plan }: { plan: PaidPlan }) {
  const Icon = plan.icon

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        plan.popular
          ? "border-primary/70 shadow-lg"
          : "border-primary/50 hover:border-primary/80"
      )}
    >
      {plan.popular ? (
        <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-xs">
          <IconSparkles className="h-3.5 w-3.5" />
          Most Popular
        </div>
      ) : null}

      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
        <Icon className="h-[22px] w-[22px]" />
      </div>

      <h3 className="mt-4 text-lg sm:text-xl font-bold tracking-tight text-foreground">
        {plan.name}
      </h3>
      <p className="mt-1 text-[13px] sm:text-sm text-muted-foreground">{plan.tagline}</p>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {plan.priceLabel}
        </span>
        <span className="text-sm text-muted-foreground">{plan.unit}</span>
      </div>

      <ul className="mt-5 space-y-2.5 border-t border-border/60 pt-5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[15px] text-foreground/85">
            <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconCheck className="h-3 w-3 stroke-[3]" />
            </div>
            <span className="leading-snug">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <RequestDialog
          label={plan.ctaLabel}
          service={plan.id}
          className="w-full rounded-xl bg-primary font-semibold shadow-xs hover:bg-primary/90"
        />
      </div>
    </div>
  )
}
