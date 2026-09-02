import { IconDownload } from "@tabler/icons-react"

import type { TemplatePreview } from "@/lib/pricing"

export function TemplateCard({ template }: { template: TemplatePreview }) {
  const Icon = template.icon

  return (
    <div className="flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
        <Icon className="h-[22px] w-[22px]" />
      </div>

      <h3 className="mt-4 text-base font-bold tracking-tight text-foreground">
        {template.name}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
        {template.description}
      </p>

      <a
        href="#newsletter"
        className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
      >
        <IconDownload className="h-3.5 w-3.5" />
        Free with the newsletter
      </a>
    </div>
  )
}
