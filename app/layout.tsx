import type { Metadata } from "next"
import { Geist_Mono, Poppins } from "next/font/google"

import "./globals.css"
import { Providers } from "@/components/providers"
import { GoogleAnalytics } from "@/components/shared/google-analytics"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MediavineTag } from "@/components/site/mediavine-tag"
import { config } from "@/lib/config"
import { cn } from "@/lib/utils"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: "Excel Insider | Spreadsheet Services, Templates & Courses",
    template: "%s | Excel Insider",
  },
  description:
    "Practical, example-driven Excel articles — formulas, shortcuts, Power Query, VBA and more.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    siteName: "Excel Insider",
    type: "website",
    url: config.siteUrl,
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Excel Insider" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/icon.png"],
  },
  manifest: "/manifest.json",
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
      className={cn("antialiased", poppins.variable, fontMono.variable, "font-sans")}
    >
      <head>
        <link rel="dns-prefetch" href="https://scripts.mediavine.com" />
        <link rel="preconnect" href="https://scripts.mediavine.com" crossOrigin="" />
        <link rel="preconnect" href="https://securepubads.g.doubleclick.net" crossOrigin="" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>
            <Providers>{children}</Providers>
          </TooltipProvider>
        </ThemeProvider>
        <GoogleAnalytics measurementId={config.gaMeasurementId} />
        <MediavineTag tagId={config.mediavineTagId} />
      </body>
    </html>
  )
}
