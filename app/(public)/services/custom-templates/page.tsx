import type { Metadata } from "next"
import Link from "next/link"
import {
  IconArrowRight,
  IconCircleCheck,
  IconFileUpload,
  IconListCheck,
  IconTable,
} from "@tabler/icons-react"

import { CtaBand } from "@/components/site/cta-band"
import { HowItWorks, type HowItWorksStep } from "@/components/site/how-it-works"
import { NewsletterBand } from "@/components/site/newsletter/newsletter-band"
import { PricingPlanCard } from "@/components/site/pricing/pricing-plan-card"
import { SectionHeading } from "@/components/site/section-heading"
import { Button } from "@/components/ui/button"
import { TEMPLATE_PLANS } from "@/lib/pricing"

const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: "01",
    title: "Pick a Plan",
    description: "Choose from Basic, Premium or Advanced.",
    icon: IconListCheck,
  },
  {
    step: "02",
    title: "Submit Your Request",
    description: "Tell us what your spreadsheet needs to do.",
    icon: IconFileUpload,
  },
  {
    step: "03",
    title: "We Build Your Template",
    description: "Clean logic, custom layout, easy to use.",
    icon: IconTable,
  },
  {
    step: "04",
    title: "Review & Finalize",
    description: "Get revisions and approve the final version.",
    icon: IconCircleCheck,
  },
]

export const metadata: Metadata = {
  title: "Custom Spreadsheet Templates | Excel Insider",
  description:
    "Custom Excel and Google Sheets templates from $25 — from a single clean worksheet to multi-sheet automated dashboards with Power Query and VBA. Delivered in days, revisions included.",
  alternates: { canonical: "/services/custom-templates" },
  openGraph: {
    title: "Custom Spreadsheet Templates | Excel Insider",
    description:
      "Excel or Google Sheets templates crafted to meet every requirement — on time and within budget. Plans from $25.",
    url: "/services/custom-templates",
    images: ["/og-default.png"],
  },
}

export default function CustomTemplatesPage() {
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
            Custom Templates · Excel & Google Sheets
          </span>

          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
            Need a Customized{" "}
            <span className="text-teal-300">Spreadsheet Template?</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Excel or Google Sheets templates crafted to meet every requirement
            — on time and within budget.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <a href="#plans">
                Get Started
                <IconArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/35 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/pricing#templates">Browse free templates</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section id="plans" className="scroll-mt-20 py-14 sm:py-18">
          <SectionHeading
            badge="Template Plans"
            title="Choose the plan that fits your needs"
            subtitle="Pick a tier, tell us what your spreadsheet needs to do — and let us do the rest."
          />

          <div className="grid gap-6 pt-3 md:grid-cols-3">
            {TEMPLATE_PLANS.map((plan) => (
              <PricingPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>

        <HowItWorks
          steps={HOW_IT_WORKS_STEPS}
          subtitle="From first request to finished template in four straightforward steps."
        />

        <div className="pt-14 sm:pt-18">
          <CtaBand
            title="Ready to get your custom spreadsheet?"
            description="Hit the button to submit your request and we'll review your needs and start working. It's fast, simple, and completely personalized."
            label="Request My Template"
            service="custom-template"
          />
        </div>

        <section className="pb-14 pt-2 sm:pb-18">
          <div id="newsletter" className="scroll-mt-20">
            <NewsletterBand source="custom-templates" />
          </div>
        </section>
      </div>
    </>
  )
}
