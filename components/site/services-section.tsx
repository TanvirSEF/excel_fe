import Image from "next/image"
import Link from "next/link"
import {
  IconArrowRight,
  IconCheck,
  IconCode,
  IconFileSpreadsheet,
  IconHelpCircle,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/site/section-heading"

const SERVICES = [
  {
    id: "consulting",
    title: "Need Help with Spreadsheet Problems?",
    subtitle:
      "Facing tricky formula bugs, sluggish workbooks, or complex logic? Get clear expert diagnostics and rapid turnaround solutions.",
    image: "/images/services/problem-solving.jpg",
    icon: IconHelpCircle,
    badge: "Troubleshooting & Consulting",
    features: [
      "Fix #VALUE!, #N/A & circular errors",
      "Optimize heavy & laggy workbooks",
      "Advanced lookup & dynamic array models",
    ],
    ctaLabel: "Request Solution",
    ctaHref: "/contact?service=troubleshooting",
  },
  {
    id: "templates",
    title: "Custom Templates & Dashboards",
    subtitle:
      "Transform raw data into executive-ready financial models, KPI trackers, and dynamic visual dashboards tailored to your brand.",
    image: "/images/services/custom-templates.jpg",
    icon: IconFileSpreadsheet,
    badge: "Custom Modeling",
    features: [
      "Executive KPI & revenue dashboards",
      "Automated financial & budgeting models",
      "Interactive Pivot Tables & smart slicers",
    ],
    ctaLabel: "Order Custom Template",
    ctaHref: "/contact?service=custom-template",
  },
  {
    id: "automation",
    title: "VBA Macros & Custom Tools",
    subtitle:
      "Eliminate repetitive manual busywork. We engineer reliable VBA macros, Google Apps Scripts, and automated pipelines.",
    image: "/images/services/automation-tools.jpg",
    icon: IconCode,
    badge: "Automation & Scripting",
    features: [
      "One-click VBA macro automations",
      "Multi-sheet data consolidation pipelines",
      "Google Apps Script & API integrations",
    ],
    ctaLabel: "Build Custom Tool",
    ctaHref: "/contact?service=automation",
  },
]

export function ServicesSection() {
  return (
    <section className="py-14 sm:py-18">
      <SectionHeading
        badge="Custom Solutions & Consulting"
        title="Professional Excel & Sheets Services"
        subtitle="Need customized help? From diagnosing stubborn formula bugs to building executive dashboards and automated pipelines — get fast, expert spreadsheet solutions."
        action={{ label: "Request a Custom Quote", href: "/contact" }}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = service.icon
          return (
            <div
              key={service.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl"
            >
              <div>
                {/* Visual Header */}
                <div className="relative aspect-16/10 w-full overflow-hidden border-b border-border/50 bg-muted">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-xs backdrop-blur-xs">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span>{service.badge}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {service.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.subtitle}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2.5 pt-2 border-t border-border/60">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-xs text-foreground/85 font-medium"
                      >
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <IconCheck className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Button
                  asChild
                  className="w-full rounded-xl bg-primary text-primary-foreground font-semibold shadow-xs transition-all duration-200 hover:bg-primary/90"
                >
                  <Link
                    href={service.ctaHref}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>{service.ctaLabel}</span>
                    <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
