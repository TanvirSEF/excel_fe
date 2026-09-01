import type { Metadata } from "next"
import Link from "next/link"
import {
  IconArrowRight,
  IconCheck,
  IconHeart,
  IconMail,
  IconRocket,
  IconShieldCheck,
  IconTarget,
} from "@tabler/icons-react"

import { SectionHeading } from "@/components/site/section-heading"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us | Excel Insider",
  description:
    "Founded in 2024, Excel Insider makes advanced Excel and Google Sheets knowledge accessible and actionable — tutorials, YouTube videos, templates, courses, and dedicated email support.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Excel Insider",
    description:
      "Meet the team behind Excel Insider — practical, in-depth tutorials and templates for intermediate to advanced Excel users.",
    url: "/about",
    images: ["/og-default.png"],
  },
}

const SNAPSHOT_FACTS = [
  { value: "2024", label: "Founded" },
  { value: "1,600+", label: "Guides published" },
  { value: "40k+", label: "Monthly readers" },
  { value: "100+", label: "Free templates" },
]

const OFFERINGS = [
  "Step-by-step blog tutorials and YouTube videos",
  "Paid and free spreadsheet templates",
  "Dedicated user problem-solving support via email",
  "Structured courses on advanced Excel topics like Power Tools, Charts, and Dashboards",
]

const MISSION_PILLARS = [
  {
    icon: IconTarget,
    title: "Our Focus",
    description:
      "To empower Excel users by providing authentic, in-depth content that's focused on real-world problems.",
  },
  {
    icon: IconShieldCheck,
    title: "Our Commitment",
    description:
      "To keep every tutorial and template accurate, actionable, and built to help you work smarter.",
  },
  {
    icon: IconHeart,
    title: "Our Concern",
    description:
      "To prioritize clarity, relevance, and your learning journey in every article we publish.",
  },
]

const TEAM_MEMBERS = [
  {
    initials: "NU",
    name: "Nehad Ulfat",
    role: "Founder",
    gradient: "from-chart-2 to-primary",
    bio: "Nehad, the founder of Excel Insider, brings over 12 years of practical experience with Microsoft Excel. Throughout his career, he has worked extensively with a wide range of Excel topics and real-world data problems in professional settings. His deep understanding of spreadsheets and passion for sharing knowledge inspire his mission to contribute meaningfully to the online spreadsheet community. Through Excel Insider, Nehad aims to help users master Excel and create impactful, efficient spreadsheet solutions.",
  },
  {
    initials: "EK",
    name: "Eshrak Kader",
    role: "Tech Expert",
    gradient: "from-primary to-chart-5",
    bio: "Eshrak is an MBA graduate from the Institute of Business Administration (IBA), University of Dhaka. With a strong academic background and a sharp analytical mind, he brings valuable expertise to our team as an experienced tech content writer. Eshrak specializes in financial and statistical topics, producing accurate, engaging, and actionable content that simplifies complex concepts for readers.",
  },
]

const TRUST_POINTS = [
  "Accurate",
  "Well-researched",
  "User-focused",
  "Practical for real-world use",
]

function SiteSnapshotCard() {
  return (
    <div className="relative hidden lg:block">
      <div className="relative rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-6 backdrop-blur-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-foreground text-xl font-bold text-primary">
            EI
          </div>
          <div className="min-w-0 space-y-1">
            <p className="font-bold text-primary-foreground">Excel Insider</p>
            <p className="text-xs text-primary-foreground/70">
              Tutorials · Templates · Courses · Support
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {SNAPSHOT_FACTS.map((fact) => (
            <div
              key={fact.label}
              className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-3"
            >
              <p className="text-lg font-bold tracking-tight text-primary-foreground">
                {fact.value}
              </p>
              <p className="text-[11px] text-primary-foreground/70">
                {fact.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -top-5 left-8 flex -rotate-2 items-center gap-2 rounded-full border border-border/70 bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-lg">
        <IconShieldCheck className="h-4 w-4 text-primary" />
        Expert-written guides
      </div>
      <div className="absolute -bottom-5 right-6 flex rotate-2 items-center gap-2 rounded-full border border-border/70 bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-lg">
        <IconRocket className="h-4 w-4 text-primary" />
        500+ tools coming soon
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      {/* 1. Banner — About Us / Our Story */}
      <section className="relative w-full overflow-hidden bg-gradient-to-bl from-chart-2 via-primary to-chart-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[580px] w-[580px] rounded-full bg-teal-300/12 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-white/8 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-white/8 via-transparent to-transparent"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-medium text-primary-foreground/90">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/70" />
              About Us
            </div>

            <h1 className="text-[2.6rem] font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl lg:text-[3rem]">
              Our <span className="text-teal-400">Story</span>
            </h1>

            <p className="max-w-md text-base leading-relaxed text-primary-foreground/75 sm:text-lg">
              Founded in 2024, Excel Insider was created with a mission to
              make advanced Excel knowledge accessible and actionable for
              users who want to level up their skills.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                asChild
                size="lg"
                className="h-11 rounded-lg bg-primary-foreground px-6 text-sm font-semibold text-primary shadow-none hover:bg-primary-foreground/90"
              >
                <Link href="/blog" className="flex items-center gap-2">
                  Explore Tutorials
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 rounded-lg border-primary-foreground/35 bg-primary-foreground/5 px-5 text-sm font-medium text-primary-foreground shadow-none hover:border-primary-foreground/60 hover:bg-primary-foreground/15 hover:text-primary-foreground"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          <SiteSnapshotCard />
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 2. Who We Are + offerings */}
        <section className="grid gap-10 py-14 sm:py-18 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Who We Are</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Accessible, actionable Excel knowledge
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Founded in 2024, Excel Insider was created with a mission to
                make advanced Excel knowledge accessible and actionable for
                users who want to level up their skills.
              </p>
              <p>
                Whether you&apos;re looking for a solution to a complex
                formula, a personalized spreadsheet template, or a deep dive
                into dashboards and pivot tables — we&apos;ve got you
                covered.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs sm:p-8">
              <h3 className="text-lg font-bold tracking-tight">
                What you get
              </h3>
              <ul className="mt-5 space-y-3.5">
                {OFFERINGS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-medium text-foreground/85"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconCheck className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
                <li className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/8 p-3.5 text-sm font-medium text-foreground">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <IconRocket className="h-3 w-3" />
                  </div>
                  <span>
                    And soon — a library of{" "}
                    <span className="font-bold text-primary">
                      500+ practical Excel tools
                    </span>{" "}
                    for everyday use.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Our Mission */}
        <section className="border-t border-border/60 py-14 sm:py-18">
          <SectionHeading
            badge="Our Mission"
            title="Our goal is simple"
            subtitle="Everything we publish follows one plan — and three promises we hold ourselves to."
          />

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-chart-2 via-primary to-chart-5 p-8 text-center shadow-lg sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-300/12 blur-2xl"
            />
            <p className="relative mx-auto max-w-2xl text-xl font-bold leading-snug tracking-tight text-primary-foreground sm:text-2xl">
              Our plan makes you feel more comfortable in Excel &amp; Google
              Sheets!
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {MISSION_PILLARS.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. Meet the Team */}
        <section className="border-t border-border/60 py-14 sm:py-18">
          <SectionHeading
            badge="Our Team"
            title="Meet the Team Behind the Screen"
            subtitle="A small, focused team writing the guides and answering your questions."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg sm:p-8"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${member.gradient} text-xl font-bold text-primary-foreground shadow-md`}
                  >
                    {member.initials}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                      {member.name}
                    </h3>
                    <p className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Why Trust Excel Insider */}
        <section className="border-t border-border/60 py-14 sm:py-18">
          <SectionHeading
            badge="Why Trust Us"
            title="Why Trust Excel Insider?"
          />

          <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
            <div className="lg:col-span-3">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                We&apos;re here to go beyond the basics and dive deep into
                what truly matters — intermediate to advanced Excel &amp;
                Google Sheets skills, crafted for users who need practical
                and effective spreadsheet solutions. Each article is
                thoughtfully designed to prioritize clarity, relevance, and
                your learning journey. Backed by a strong foundation in tech
                content strategy and in-depth expertise in Excel and Google
                Sheets, we deliver tutorials and templates that are
                accurate, actionable, and built to help you work smarter.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:col-span-2 lg:content-start">
              {TRUST_POINTS.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-card px-4 py-3 text-sm font-semibold shadow-2xs"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconCheck className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span className="leading-tight">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Let's Connect */}
        <section className="pb-16 pt-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-chart-2 via-primary to-chart-5 px-6 py-14 text-center shadow-xl sm:px-12 sm:py-18">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-teal-300/12 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            />
            <div className="relative mx-auto max-w-2xl space-y-5">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Let&apos;s Connect
              </h2>
              <p className="text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
                Have a question, need a custom solution, or want to
                collaborate?
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <a
                  href="mailto:contact@excelinsider.com"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-xs font-medium text-primary-foreground/90 transition-colors hover:bg-primary-foreground/20"
                >
                  <IconMail className="h-4 w-4" />
                  contact@excelinsider.com
                </a>
              </div>

              <div className="pt-3">
                <Button
                  asChild
                  size="lg"
                  className="h-11 rounded-lg bg-primary-foreground px-6 text-sm font-semibold text-primary shadow-none hover:bg-primary-foreground/90"
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    Contact Us
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
