import Image from "next/image"
import { IconCheck, IconDownload, IconMail } from "@tabler/icons-react"

import { NewsletterForm } from "@/components/site/newsletter/newsletter-form"

const BENEFITS = [
  "Instant 50+ Essential Excel Formulas Cheat Sheet PDF",
  "1 Practical 3-minute spreadsheet trick every Tuesday",
  "Free downloadable business templates & VBA shortcuts",
]

export function NewsletterBand({
  source = "home-band",
}: {
  source?: string
}) {
  return (
    <section className="relative my-8 overflow-hidden rounded-3xl bg-gradient-to-br from-chart-2 via-primary to-chart-5 p-8 text-primary-foreground shadow-xl sm:p-12 lg:p-14">
      {/* Decorative ambient glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/8 blur-3xl"
      />
      {/* Subtle shine overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"
      />

      <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* ── Left Column: Value Copy & Form ── */}
        <div className="space-y-6 lg:col-span-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs">
            <IconMail className="h-3.5 w-3.5" />
            <span>Weekly Excel Insider Newsletter</span>
          </div>

          {/* Heading */}
          <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            Level Up Your Spreadsheet Skills — Get Our Free 50+ Formula PDF Guide
          </h2>

          {/* Subtitle */}
          <p className="max-w-xl text-balance text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
            Join <strong className="text-white font-bold">40,000+</strong> data analysts, finance managers, and spreadsheet learners. Bite-sized formula breakdowns and free templates sent directly to your inbox every week.
          </p>

          {/* Value Bullet Points */}
          <ul className="space-y-2.5 pt-1">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2.5 text-xs font-medium text-primary-foreground/90 sm:text-sm"
              >
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground">
                  <IconCheck className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Form */}
          <div className="pt-2">
            <NewsletterForm source={source} variant="band" />
          </div>
        </div>

        {/* ── Right Column: 3D Cheat Sheet Mockup ── */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          <div className="group relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-3 shadow-2xl backdrop-blur-xs transition-transform duration-500 hover:scale-102">
            <Image
              src="/images/newsletter-ebook.png"
              alt="50+ Essential Excel Formulas Free PDF Guide"
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-cover rounded-xl"
            />
            {/* Tag overlay */}
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-background/90 px-3 py-1 text-xs font-bold text-foreground shadow-md backdrop-blur-xs">
              <IconDownload className="h-3.5 w-3.5 text-primary" />
              <span>Free Instant Download</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
