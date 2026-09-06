import type { Metadata } from "next"
import Link from "next/link"
import {
  IconArrowRight,
  IconCircleCheck,
  IconCode,
  IconFileUpload,
  IconListCheck,
  IconRocket,
} from "@tabler/icons-react"

import { CtaBand } from "@/components/site/cta-band"
import { HowItWorks, type HowItWorksStep } from "@/components/site/how-it-works"
import { NewsletterBand } from "@/components/site/newsletter/newsletter-band"
import { PricingPlanCard } from "@/components/site/pricing/pricing-plan-card"
import { SectionHeading } from "@/components/site/section-heading"
import { Button } from "@/components/ui/button"
import { TOOL_PLANS } from "@/lib/pricing"

const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: "01",
    title: "Choose Your Plan",
    description:
      "Select the Professional or Advanced tool plan that best fits your needs.",
    icon: IconListCheck,
  },
  {
    step: "02",
    title: "Submit Your Request",
    description:
      "Share what the tool needs to accomplish — purpose, data inputs, outputs, logic, branding, timeline and integrations.",
    icon: IconFileUpload,
  },
  {
    step: "03",
    title: "We Build the Tool",
    description:
      "Our expert developers create a clean, logical, user-friendly tool tailored to your specs.",
    icon: IconCode,
  },
  {
    step: "04",
    title: "Review & Refine",
    description:
      "You'll receive a draft for review. Provide feedback and request revisions.",
    icon: IconCircleCheck,
  },
  {
    step: "05",
    title: "Finalize & Deliver",
    description:
      "After polishing, we deliver the final tool — ready for use, with support to ensure smooth deployment.",
    icon: IconRocket,
  },
]

export const metadata: Metadata = {
  title: "Custom Spreadsheet Tools & Add-ons | Excel Insider",
  description:
    "Custom Excel and Google Sheets tools from $500, and full Google Workspace add-ons or Chrome extensions from $1200 — automation, dashboards, API integrations, delivered with revisions and docs.",
  alternates: { canonical: "/services/custom-tools" },
  openGraph: {
    title: "Custom Spreadsheet Tools & Add-ons | Excel Insider",
    description:
      "Expertly designed custom spreadsheet tools — delivered on time and on budget. Professional tools from $500, Workspace add-ons from $1200.",
    url: "/services/custom-tools",
    images: ["/og-default.png"],
  },
}

export default function CustomToolsPage() {
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
            Custom Tools · Automation · Workspace Add-ons
          </span>

          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
            Need a Custom Spreadsheet Tool{" "}
            <span className="text-teal-300">Built Just for You?</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Expertly designed, custom spreadsheet tools — delivered on time and
            on budget.
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
              <Link href="/pricing">Compare all services</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section id="plans" className="scroll-mt-20 py-14 sm:py-18">
          <SectionHeading
            badge="Tool Plans"
            title="Choose the plan that fits your needs"
            subtitle="Pick a tier, tell us what your tool needs to do — and let us do the rest."
          />

          <div className="mx-auto grid max-w-4xl gap-6 pt-3 md:grid-cols-2">
            {TOOL_PLANS.map((plan) => (
              <PricingPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>

        <HowItWorks
          steps={HOW_IT_WORKS_STEPS}
          subtitle="From first request to deployed tool in five straightforward steps."
        />

        <div className="pt-14 sm:pt-18">
          <CtaBand
            title="Ready to get your custom spreadsheet tool?"
            description="Click the button to submit your request — tell us what you need, and we'll get working on a tailored solution."
            label="Request My Tool"
            service="automation"
          />
        </div>

        <section className="pb-14 pt-2 sm:pb-18">
          <div id="newsletter" className="scroll-mt-20">
            <NewsletterBand source="custom-tools" />
          </div>
        </section>
      </div>
    </>
  )
}
