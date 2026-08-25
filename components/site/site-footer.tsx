import Image from "next/image"
import Link from "next/link"
import {
  IconArrowUpRight,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
  IconMail,
  IconShieldCheck,
} from "@tabler/icons-react"

const SERVICES_LINKS = [
  { label: "Spreadsheet Troubleshooting", href: "/contact?service=troubleshooting" },
  { label: "Custom Executive Dashboards", href: "/contact?service=custom-template" },
  { label: "VBA & Macro Automations", href: "/contact?service=automation" },
  { label: "Financial Modeling Services", href: "/contact?service=modeling" },
  { label: "Request a Custom Quote", href: "/contact" },
]

const EXPLORE_LINKS = [
  { label: "Excel Formulas & Functions", href: "/blog" },
  { label: "VBA & Macro Tutorials", href: "/blog" },
  { label: "Pivot Tables & Dashboards", href: "/blog" },
  { label: "Google Sheets & Apps Script", href: "/blog" },
  { label: "Free Interactive Calculators", href: "/calculators" },
]

const COMPANY_LINKS = [
  { label: "About Excel Insider", href: "/about" },
  { label: "Contact & Support", href: "/contact" },
  { label: "Pricing & Templates", href: "/pricing" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

const SOCIAL_LINKS = [
  { label: "YouTube", href: "https://youtube.com", icon: IconBrandYoutube },
  { label: "X (Twitter)", href: "https://x.com", icon: IconBrandX },
  { label: "LinkedIn", href: "https://linkedin.com", icon: IconBrandLinkedin },
  { label: "Facebook", href: "https://facebook.com", icon: IconBrandFacebook },
  { label: "GitHub", href: "https://github.com", icon: IconBrandGithub },
]

export function SiteFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-br from-chart-2 via-primary to-chart-5 text-primary-foreground">
      {/* ── Background Geometric Shapes & Ambient Glows ── */}
      
      {/* Top Border Glow Line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />

      {/* Subtle Dot Grid Matrix */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(var(--color-primary-foreground)_1px,transparent_1px)] [background-size:32px_32px]"
      />

      {/* Large Ambient Glow Orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-white/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-white/5 blur-2xl"
      />

      {/* Decorative Geometric Floating Elements */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-12 top-20 h-36 w-36 rotate-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xs"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 bottom-24 h-48 w-48 -rotate-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xs"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 -bottom-10 h-32 w-32 rotate-45 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xs"
      />

      {/* Diagonal Shine Layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 sm:px-8 lg:px-12">
        {/* ── Main 4-Column Grid ── */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          
          {/* Column 1: Brand & Contact (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-white/95 px-3.5 py-2 shadow-sm transition-transform hover:scale-[1.02]"
            >
              <Image
                src="/logo.png"
                alt="Excel Insider"
                width={160}
                height={42}
                className="h-8 w-auto object-contain"
              />
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/80">
              Your go-to authority resource for mastering essential spreadsheet formulas, solving complex workbook challenges, and accessing bespoke business templates.
            </p>

            {/* Email Contact Badge */}
            <div>
              <a
                href="mailto:contact@excelinsider.com"
                className="group inline-flex items-center gap-2.5 rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs backdrop-blur-xs transition-all duration-200 hover:border-primary-foreground/50 hover:bg-primary-foreground hover:text-primary hover:shadow-md"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20 text-primary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <IconMail className="h-3.5 w-3.5" />
                </div>
                <span>contact@excelinsider.com</span>
              </a>
            </div>

            {/* Social Media Glass Icons */}
            <div className="space-y-2.5 pt-1">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/70">
                Follow Excel Insider
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground shadow-xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary-foreground/50 hover:bg-primary-foreground hover:text-primary hover:shadow-lg"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Explore Tutorials (2.5 cols) */}
          <div className="space-y-4 lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground">
              Tutorials &amp; Guides
            </p>
            <ul className="space-y-2.5 text-sm">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-primary-foreground/80 transition-colors hover:text-primary-foreground hover:translate-x-0.5 duration-200"
                  >
                    <span>{link.label}</span>
                    <IconArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 text-primary-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Custom Services (2.5 cols) */}
          <div className="space-y-4 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground">
              Services
            </p>
            <ul className="space-y-2.5 text-sm">
              {SERVICES_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-primary-foreground/80 transition-colors hover:text-primary-foreground hover:translate-x-0.5 duration-200"
                  >
                    <span>{link.label}</span>
                    <IconArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 text-primary-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company & Policy (2 cols) */}
          <div className="space-y-4 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground">
              Company
            </p>
            <ul className="space-y-2.5 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 transition-colors hover:text-primary-foreground hover:translate-x-0.5 duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar: Copyright & Badges ── */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/20 pt-8 text-xs text-primary-foreground/75 sm:flex-row">
          <p>
            © {new Date().getFullYear()} <strong className="font-semibold text-primary-foreground">Excel Insider</strong>. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-[11px] font-semibold text-primary-foreground backdrop-blur-xs">
              <IconShieldCheck className="h-3.5 w-3.5" />
              <span>Excel 365 &amp; Google Sheets Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
