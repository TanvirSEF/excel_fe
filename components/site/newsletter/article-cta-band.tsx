import { IconSparkles } from "@tabler/icons-react"

import { NewsletterForm } from "@/components/site/newsletter/newsletter-form"
import { cn } from "@/lib/utils"

interface ArticleCtaBandProps {
  source: string
  heading: string
  className?: string
}

export function ArticleCtaBand({ source, heading, className }: ArticleCtaBandProps) {
  return (
    <div
      className={cn(
        "relative mt-10 overflow-hidden rounded-2xl bg-gradient-to-bl from-chart-2 via-primary to-chart-5 p-6 text-primary-foreground shadow-xl sm:p-8",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-white/10 via-transparent to-transparent"
      />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-primary-foreground/90">
          <IconSparkles className="h-3.5 w-3.5" />
          Free Weekly Tips
        </span>
        <p className="mt-3 text-lg font-bold tracking-tight text-balance">{heading}</p>
        <div className="mt-4">
          <NewsletterForm source={source} variant="band" />
        </div>
      </div>
    </div>
  )
}
