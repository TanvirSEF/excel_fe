import Image from "next/image"
import Link from "next/link"
import { IconCheck, IconShieldCheck } from "@tabler/icons-react"

const PANEL_POINTS = [
  "1,600+ free tutorials & formula deep-dives",
  "40,000+ monthly readers level up here",
  "100+ business templates & spreadsheet tools",
]

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid w-full lg:grid-cols-2 lg:min-h-[75svh]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-bl from-chart-2 via-primary to-chart-5 p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-300/12 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-white/8 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-white/8 via-transparent to-transparent"
        />

        <Link href="/" className="relative block w-fit" aria-label="Excel Insider">
          <Image
            src="/logo.png"
            alt="Excel Insider"
            width={52}
            height={52}
            className="rounded-xl"
          />
        </Link>

        <div className="relative max-w-md space-y-6">
          <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            The spreadsheet authority behind{" "}
            <span className="text-teal-300">1,600+ tutorials.</span>
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-primary-foreground/80">
            Formulas, VBA automation, Pivot Tables and dashboards — written for
            real workbook work, trusted by analysts worldwide.
          </p>
          <ul className="space-y-3 pt-1">
            {PANEL_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 text-sm font-medium text-primary-foreground/90"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground">
                  <IconCheck className="h-3 w-3 stroke-[3]" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-semibold text-primary-foreground/90">
          <IconShieldCheck className="h-3.5 w-3.5" />
          Excel 365 & Google Sheets Verified
        </div>
      </aside>

      <div className="flex items-center justify-center px-4 py-14 sm:py-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex justify-center lg:hidden">
            <Image
              src="/logo.png"
              alt="Excel Insider"
              width={44}
              height={44}
              className="rounded-xl"
            />
          </div>
          {children}
          <p className="mt-5 text-center text-xs text-muted-foreground">
            <Link
              href="/"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              ← Back to Excel Insider
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
