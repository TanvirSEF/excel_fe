import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowRight, IconCheck } from "@tabler/icons-react"

import { NewsletterBand } from "@/components/site/newsletter/newsletter-band"
import { PricingFaq } from "@/components/site/pricing/pricing-faq"
import { PricingPlanCard } from "@/components/site/pricing/pricing-plan-card"
import { TemplateCard } from "@/components/site/pricing/template-card"
import { SectionHeading } from "@/components/site/section-heading"
import { Button } from "@/components/ui/button"
import { FREE_PLAN, FREE_TEMPLATES, PAID_PLANS } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "Pricing & Free Templates | Excel Insider",
  description:
    "Every tutorial, calculator and template on Excel Insider is free. Custom dashboards from $149, VBA & Apps Script automation from $199, expert consulting from $45/hour — always quoted upfront.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing & Free Templates | Excel Insider",
    description:
      "One free library, three custom services — custom templates, automation and consulting, always quoted upfront.",
    url: "/pricing",
    images: ["/og-default.png"],
  },
}

export default function PricingPage() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-gradient-to-bl from-chart-2 via-primary to-chart-5">
        <div
          aria-hidden
          className="absolute -top-24 right-[10%] h-72 w-72 rounded-full bg-teal-300/12 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-[5%] h-64 w-64 rounded-full bg-white/8 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-bl from-white/8 via-transparent to-transparent"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-primary-foreground/90 backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
            Free Templates · No Paywall
          </span>

          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
            Free Templates.{" "}
            <span className="text-teal-300">Simple Pricing.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Everything to read, calculate and download is free — no account, no
            paywall. When you need something bespoke, custom work starts at $45
            and is always quoted upfront.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <a href="#templates">
                Browse free templates
                <IconArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/35 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/contact">Get a custom quote</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section id="plans" className="scroll-mt-20 py-14 sm:py-18">
          <SectionHeading
            badge="Pricing & Plans"
            title="One free library, three custom services"
            subtitle="Everything to read and download is free. When you need something bespoke, pick a package — every project gets an upfront fixed quote."
          />

          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 shadow-2xs sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
                    {FREE_PLAN.name}
                  </span>
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    {FREE_PLAN.priceLabel}
                    <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                      {FREE_PLAN.unit}
                    </span>
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-foreground/85 sm:text-base">
                  {FREE_PLAN.tagline}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {FREE_PLAN.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-2xs"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <IconCheck className="h-2.5 w-2.5 stroke-[3]" />
                      </span>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row lg:flex-col">
                <Button asChild className="rounded-xl font-semibold">
                  <Link href={FREE_PLAN.primaryCta.href}>
                    {FREE_PLAN.primaryCta.label}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl font-semibold"
                >
                  <Link href={FREE_PLAN.secondaryCta.href}>
                    {FREE_PLAN.secondaryCta.label}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 pt-3 md:grid-cols-3">
            {PAID_PLANS.map((plan) => (
              <PricingPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>

        <section
          id="templates"
          className="scroll-mt-20 border-t border-border/60 py-14 sm:py-18"
        >
          <SectionHeading
            badge="100+ Free Templates"
            title="Reader-favorite free templates"
            subtitle="Eight of the most-requested downloads — the full library ships free through the weekly newsletter."
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FREE_TEMPLATES.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 py-14 sm:py-18">
          <SectionHeading
            badge="Got Questions?"
            title="Pricing FAQs"
            subtitle="What is free, how custom work is quoted, and how the templates reach your inbox."
          />
          <PricingFaq />
        </section>

        <section className="pb-14 pt-2 sm:pb-18">
          <div id="newsletter" className="scroll-mt-20">
            <NewsletterBand source="pricing" />
          </div>
        </section>
      </div>
    </>
  )
}
