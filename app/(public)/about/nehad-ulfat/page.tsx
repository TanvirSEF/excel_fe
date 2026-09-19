import type { Metadata } from "next"
import Link from "next/link"
import {
  IconArrowRight,
  IconAward,
  IconBrandLinkedin,
  IconBriefcase,
  IconCalendar,
  IconCheck,
  IconExternalLink,
  IconFileSpreadsheet,
  IconMail,
  IconRocket,
  IconSchool,
  IconUsers,
} from "@tabler/icons-react"

import { Breadcrumb } from "@/components/site/breadcrumb"
import { config } from "@/lib/config"

export const metadata: Metadata = {
  title: "About Nehad Ulfat | Founder & Strategist at Excel Insider",
  description:
    "Nehad Ulfat is a spreadsheet expert, consultant, and founder of Excel Insider with 15+ years of experience solving real-world spreadsheet problems through advanced formulas, automation, and consulting.",
  alternates: { canonical: "/about/nehad-ulfat" },
  openGraph: {
    title: "About Nehad Ulfat | Founder & Strategist at Excel Insider",
    description:
      "Spreadsheet expert, consultant, and founder of Excel Insider. 15+ years of experience in Excel, Google Sheets, automated templates, and custom business solutions.",
    url: "/about/nehad-ulfat",
    images: ["/og-default.png"],
  },
}

const STATS = [
  {
    value: "15+ Years",
    label: "Spreadsheet Experience",
    icon: IconCalendar,
    description: "Advanced formulas, data analysis & automation",
  },
  {
    value: "100+",
    label: "Tutorials Authored",
    icon: IconFileSpreadsheet,
    description: "In-depth Excel guides at ExcelDemy",
  },
  {
    value: "80+",
    label: "Writers Trained",
    icon: IconUsers,
    description: "Built writing teams & operational workflows",
  },
  {
    value: "~1M",
    label: "Year 1 Sessions",
    icon: IconRocket,
    description: "Reached worldwide on Excel Insider",
  },
]

const EXPERTISE_AREAS = [
  "Advanced Spreadsheet Formulas",
  "Excel & Google Sheets Solutions",
  "Data Analysis & Statistical Modeling",
  "Automated Template Architecture",
  "Technical Content Strategy",
  "Writer Training & Team Leadership",
  "Custom Business Tracking Systems",
  "Hands-On Practice Spreadsheets",
]

export default function NehadUlfatProfilePage() {
  const personJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nehad Ulfat",
    jobTitle: "Founder & Strategist",
    worksFor: {
      "@type": "Organization",
      name: "Excel Insider",
      url: config.siteUrl,
    },
    url: `${config.siteUrl}/about/nehad-ulfat`,
    sameAs: ["https://www.linkedin.com/in/nehad-ulfat-22042017b"],
    description:
      "Nehad Ulfat is a spreadsheet expert, consultant, and the founder of Excel Insider specializing in advanced formulas, data analysis, and automated templates.",
  })

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLd }}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Nehad Ulfat" },
        ]}
      />

      {/* Hero Header Card */}
      <header className="relative mt-6 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-chart-2/15 via-primary/10 to-transparent p-6 sm:p-10 shadow-xs">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-2 to-primary text-2xl font-bold text-primary-foreground shadow-md">
              NU
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                Founder &amp; Strategist
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Nehad Ulfat
              </h1>
              <p className="text-sm sm:text-base font-medium text-muted-foreground">
                Founder &amp; Strategist at Excel Insider · Spreadsheet Expert &amp; Consultant
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.linkedin.com/in/nehad-ulfat-22042017b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-4 py-2.5 text-sm font-semibold text-foreground shadow-2xs backdrop-blur-xs transition-all hover:border-primary/60 hover:text-primary hover:shadow-xs"
            >
              <IconBrandLinkedin className="h-4 w-4 text-[#0A66C2]" />
              <span>LinkedIn Profile</span>
              <IconExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-2xs transition-all hover:bg-primary/90 hover:shadow-xs"
            >
              <IconMail className="h-4 w-4" />
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Key Stats Showcase */}
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-primary/25 bg-card p-4 sm:p-5 shadow-2xs transition-all hover:border-primary/50 hover:shadow-xs"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-bold text-foreground/90">
                {stat.label}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                {stat.description}
              </p>
            </div>
          )
        })}
      </section>

      {/* Main Biography & Vision */}
      <section className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Full Biography Narrative */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-2xs">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              About Nehad Ulfat
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Nehad Ulfat is a spreadsheet expert, consultant, and the founder of{" "}
                <strong className="text-foreground">Excel Insider</strong>, a platform
                dedicated to solving real-world spreadsheet problems through practical
                tutorials and professional spreadsheet services. With more than 15 years
                of experience working with spreadsheets, he specializes in advanced
                spreadsheet formulas, data analysis, statistical analysis, and building
                automated templates using Microsoft Excel and Google Sheets.
              </p>

              <p>
                Nehad began his journey as an Excel &amp; VBA content developer and
                later became a key contributor at{" "}
                <a
                  href="https://www.exceldemy.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary"
                >
                  ExcelDemy
                </a>
                , where he authored more than 100 in-depth Excel tutorials. Between 2021
                and 2023, he played a major leadership role in managing the
                platform’s content operations. During this time, he trained more than 80
                writers, developed team leaders, managed multiple writing teams, and
                helped solve thousands of spreadsheet-related queries from users around
                the world.
              </p>

              <p>
                Now Nehad leads Excel Insider as its owner and content strategist, where
                he oversees every aspect of the platform—from content strategy to writer
                training, quality control, and client service management. Under his
                leadership, the website has already reached around{" "}
                <strong className="text-foreground">1 million sessions</strong> within
                its first year, helping spreadsheet users worldwide find reliable and
                practical solutions.
              </p>

              <p>
                Through Excel Insider, Nehad focuses primarily on intermediate and
                advanced spreadsheet challenges rather than basic tutorials. His approach
                is to identify real user problems that often lack clear solutions online
                and develop well-researched guides that combine existing knowledge with
                newly tested methods. Each tutorial is designed with hands-on examples,
                practice spreadsheets, and supporting video content to ensure readers can
                apply the solutions effectively.
              </p>

              <p>
                In addition to tutorials, Nehad also provides professional spreadsheet
                services, including custom spreadsheet development, automated template
                creation, and analytical solutions for businesses. One example includes
                building a fully automated employee tracking system for software company{" "}
                <a
                  href="https://www.softeko.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary"
                >
                  SOFTEKO
                </a>
                .
              </p>

              <p>
                Although Nehad is academically trained as a Naval Architect and Marine
                Engineer, his passion for spreadsheets and data analysis led him to build
                a career in the spreadsheet and technical content industry. Nehad is
                passionate about simplifying complex spreadsheet problems and helping
                people turn raw data into meaningful insights. His long-term vision for
                Excel Insider is to build a dedicated platform where individuals and
                businesses around the world can easily find expert help for spreadsheet
                solutions.
              </p>
            </div>
          </div>

          {/* Practical Problem Solving Highlight Card */}
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <IconAward className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Editorial &amp; Problem-Solving Philosophy
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Focusing on intermediate and advanced challenges that lack clear solutions
              online, every guide on Excel Insider combines hands-on examples, practice
              spreadsheets, and video demonstrations to turn complex spreadsheet problems
              into reliable, real-world solutions.
            </p>
          </div>
        </div>

        {/* Right Sidebar: Expertise & Services */}
        <aside className="space-y-6">
          {/* Areas of Expertise */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-2xs">
            <h3 className="text-base font-bold text-foreground">
              Core Areas of Expertise
            </h3>
            <ul className="mt-4 space-y-2.5">
              {EXPERTISE_AREAS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconCheck className="h-2.5 w-2.5" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Background & Engineering Mindset */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-2xs">
            <div className="flex items-center gap-2.5 text-foreground">
              <IconSchool className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold">Engineering Discipline</h3>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Trained in <strong>Naval Architecture &amp; Marine Engineering</strong>,
              Nehad applies engineering precision, structural logic, and data
              validation to complex business spreadsheet systems.
            </p>
          </div>

          {/* Consulting Services Card */}
          <div className="rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/10 via-card to-card p-6 shadow-xs">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <IconBriefcase className="h-4 w-4" />
              <span>Professional Services</span>
            </div>
            <h4 className="mt-2 text-base font-bold text-foreground">
              Need a Custom Spreadsheet Solution?
            </h4>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              From enterprise dashboard creation to automated tracking tools, Nehad
              provides bespoke consulting and custom development for businesses
              worldwide.
            </p>
            <div className="mt-4 pt-4 border-t border-border/60">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-2xs transition-all hover:bg-primary/90"
              >
                <span>Request a Consultation</span>
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
