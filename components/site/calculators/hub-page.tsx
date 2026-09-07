import Link from "next/link"
import {
  IconArrowRight,
  IconChevronDown,
  IconTarget,
} from "@tabler/icons-react"

import { SectionHeading } from "@/components/site/section-heading"
import type { CalculatorHub } from "@/lib/calculators"

interface HubPageProps {
  hub: CalculatorHub
}

export function HubPage({ hub }: HubPageProps) {
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
            {hub.badge}
          </span>

          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
            {hub.title}{" "}
            <span className="text-teal-300">{hub.titleAccent}</span>
          </h1>

          <div className="mx-auto mt-4 max-w-3xl space-y-3">
            {hub.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-primary/25 bg-primary/5 px-5 py-4 text-sm leading-relaxed text-foreground/85 sm:px-6">
          {hub.hubNote}
        </div>

        {hub.groups.map((group) => {
          const GroupIcon = group.icon
          return (
            <section
              key={group.title}
              id={group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className="scroll-mt-20 border-t border-border/60 py-12 first:border-t-0 sm:py-14"
            >
              <SectionHeading
                badge={`${group.calculators.length} tools`}
                title={group.title}
                subtitle={group.tagline}
              />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.calculators.map((calculator) => (
                  <Link
                    key={calculator.slug}
                    href={`/calculators/${hub.slug}/${calculator.slug}`}
                    className="group flex flex-col rounded-2xl border border-primary/50 bg-card p-5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/80 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${group.accent}`}
                      >
                        <GroupIcon className="h-[22px] w-[22px]" />
                      </div>
                      <IconArrowRight className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                    </div>

                    <h3 className="mt-4 text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
                      {calculator.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {calculator.whatItIs}
                    </p>

                    <div className="mt-auto pt-4">
                      <div className="flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5">
                        <IconTarget className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <p className="text-xs leading-relaxed text-foreground/80">
                          {calculator.whatToExpect}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        <section className="border-t border-border/60 py-14 sm:py-18">
          <SectionHeading
            badge="Got Questions?"
            title="Everything You Need to Know About Our Tools"
            subtitle="Accuracy, explanations, privacy — the answers to what people ask most."
          />

          <div className="mx-auto max-w-4xl space-y-4">
            {hub.faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-primary/40 bg-card p-5 shadow-2xs transition-all duration-200 open:border-primary/70 open:shadow-xs hover:border-primary/60"
                {...(index === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-foreground transition-colors group-open:text-primary hover:text-primary">
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:bg-primary/10 group-open:text-primary">
                    <IconChevronDown className="h-4 w-4" />
                  </div>
                </summary>
                <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {faq.answer}
                </p>
                {faq.bullets ? (
                  <ul className="mt-3 space-y-2">
                    {faq.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 rounded-xl border border-primary/15 bg-primary/5 px-3.5 py-2.5 text-sm text-foreground/85"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
