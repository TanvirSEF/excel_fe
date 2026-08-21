import type { Metadata } from "next"
import { DM_Sans, Geist_Mono } from "next/font/google"

import "./globals.css"
import { Providers } from "@/components/providers"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { config } from "@/lib/config"
import { cn } from "@/lib/utils"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: "Excel Insider — Excel formulas, tips & deep dives",
    template: "%s | Excel Insider",
  },
  description:
    "Practical, example-driven Excel guides — formulas, shortcuts, Power Query, VBA and more.",
  openGraph: {
    siteName: "Excel Insider",
    type: "website",
    url: config.siteUrl,
  },
  twitter: { card: "summary" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", dmSans.variable, fontMono.variable, "font-sans")}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>
            <Providers>{children}</Providers>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
