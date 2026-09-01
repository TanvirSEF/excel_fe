import type { Metadata } from "next"
import { IconClock, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react"

import { Breadcrumb } from "@/components/site/breadcrumb"
import { ContactForm } from "@/components/site/contact-form"
import { firstParam } from "@/lib/utils"

interface ContactPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
  title: "Contact Us | Excel Insider",
  description:
    "Questions, custom template requests, or spreadsheet troubleshooting — reach the Excel Insider team by form, phone, or email.",
  alternates: { canonical: "/contact" },
}

const CONTACT_DETAILS = [
  {
    label: "Address",
    value: "15, Tallabag, Moneshwar Road, Jigatola, Dhaka-1209",
    icon: IconMapPin,
    href: undefined,
  },
  {
    label: "Phone",
    value: "+880 1314 999 034",
    icon: IconPhone,
    href: "tel:+8801314999034",
  },
  {
    label: "Email",
    value: "contact@excelinsider.com",
    icon: IconMail,
    href: "mailto:contact@excelinsider.com",
  },
]

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const query = await searchParams
  const service = firstParam(query.service) ?? null

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <header className="max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span>Contact &amp; Support</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in Touch
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Have a question or want to get in touch with us? We&apos;d love to
          hear from you! Please use the contact form below or reach out
          directly through the provided details.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-5 lg:gap-8">
        <aside className="space-y-5 lg:col-span-2">
          {CONTACT_DETAILS.map((item) => {
            const Icon = item.icon
            const content = (
              <>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium leading-relaxed text-foreground transition-colors group-hover:text-primary">
                    {item.value}
                  </p>
                </div>
              </>
            )
            const cardClass =
              "group flex items-start gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"

            return item.href ? (
              <a key={item.label} href={item.href} className={cardClass}>
                {content}
              </a>
            ) : (
              <div key={item.label} className={cardClass}>
                {content}
              </div>
            )
          })}

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-chart-2 via-primary to-chart-5 p-6 text-primary-foreground shadow-lg">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary-foreground/25 bg-primary-foreground/10">
                <IconClock className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold tracking-tight">24–48 hours</p>
              <p className="text-sm leading-relaxed text-primary-foreground/75">
                We usually respond within 24–48 hours on business days. For
                urgent workbook emergencies, call us directly.
              </p>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <ContactForm service={service} />
        </div>
      </div>
    </div>
  )
}
