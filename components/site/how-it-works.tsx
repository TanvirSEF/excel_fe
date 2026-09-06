import type { TablerIcon } from "@tabler/icons-react"

import { SectionHeading } from "@/components/site/section-heading"
import { cn } from "@/lib/utils"

export interface HowItWorksStep {
  step: string
  title: string
  description: string
  icon: TablerIcon
}

interface HowItWorksProps {
  steps: HowItWorksStep[]
  badge?: string
  title?: string
  subtitle?: string
}

export function HowItWorks({
  steps,
  badge = "Simple Process",
  title = "How It Works",
  subtitle,
}: HowItWorksProps) {
  return (
    <section className="border-t border-border/60 py-14 sm:py-18">
      <SectionHeading badge={badge} title={title} subtitle={subtitle} />

      <div
        className={cn(
          "grid gap-6",
          steps.length === 4
            ? "md:grid-cols-2 lg:grid-cols-4"
            : steps.length === 3
              ? "md:grid-cols-3"
              : "sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.step}
              className="rounded-2xl border border-primary/50 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/80 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="h-[22px] w-[22px]" />
                </div>
                <span className="text-4xl font-bold leading-none text-primary/15">
                  {step.step}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
