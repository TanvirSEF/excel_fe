import { RequestDialog } from "@/components/site/pricing/request-dialog"

interface CtaBandProps {
  title?: string
  description?: string
  label?: string
  service?: string | null
}

export function CtaBand({
  title = "Ready to get help with your spreadsheet?",
  description = "Submit your request and we'll review your needs and start working. It's fast, simple, and completely personalized.",
  label = "Request for Help",
  service = null,
}: CtaBandProps) {
  return (
    <section className="relative my-8 overflow-hidden rounded-3xl bg-gradient-to-br from-chart-2 via-primary to-chart-5 p-8 text-center text-primary-foreground shadow-xl sm:p-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"
      />

      <div className="relative mx-auto max-w-2xl space-y-5">
        <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <p className="text-balance text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
          {description}
        </p>
        <RequestDialog
          label={label}
          service={service}
          className="rounded-xl bg-primary-foreground font-semibold text-primary hover:bg-primary-foreground/90"
        />
      </div>
    </section>
  )
}
