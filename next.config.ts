import type { NextConfig } from "next"

const apiUrl = process.env.API_URL ?? "https://api.excelinsider.com"

const mediaHosts = (process.env.NEXT_PUBLIC_MEDIA_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean)

const mediaHostCsp = mediaHosts.length
  ? mediaHosts.map((h) => `https://${h}`).join(" ")
  : ""

const isDev = process.env.NODE_ENV === "development"

const cspValue = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://www.googletagmanager.com`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  `img-src 'self' data: blob: https://i.ytimg.com https://*.google-analytics.com https://*.googletagmanager.com ${mediaHostCsp}`.trimEnd(),
  `frame-src https://www.youtube-nocookie.com https://player.vimeo.com`,
  `connect-src 'self' ${apiUrl} https://vitals.vercel-insights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com${isDev ? " http://localhost:* ws://localhost:* wss://localhost:* webpack://" : ""}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  ...(!isDev ? [`upgrade-insecure-requests`] : []),
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspValue },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: mediaHosts.length
      ? mediaHosts.map((hostname) => ({ protocol: "https" as const, hostname }))
      : [{ protocol: "https" as const, hostname: "**" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: `${apiUrl}/sitemap.xml`,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/about-us/nehadulfat",
        destination: "/about/nehad-ulfat",
        permanent: true,
      },
      {
        source: "/about-us/nehadulfat/:slug*",
        destination: "/about/nehad-ulfat",
        permanent: true,
      },
      {
        source: "/calculators",
        destination: "/calculator/",
        permanent: true,
      },
      {
        source: "/calculators/:path*",
        destination: "/calculator/:path*/",
        permanent: true,
      },
      {
        source: "/accounting-calculator/:path*",
        destination: "/calculator/accounting/:path*/",
        permanent: true,
      },
      {
        source: "/pricing",
        destination: "/spreadsheet-solutions/",
        permanent: true,
      },
      {
        source: "/pricing/:path*",
        destination: "/spreadsheet-solutions/",
        permanent: true,
      },
      {
        source: "/services/custom-templates",
        destination: "/custom-templates/",
        permanent: true,
      },
      {
        source: "/services/custom-templates/:path*",
        destination: "/custom-templates/",
        permanent: true,
      },
      {
        source: "/services/custom-tools",
        destination: "/custom-tools/",
        permanent: true,
      },
      {
        source: "/services/custom-tools/:path*",
        destination: "/custom-tools/",
        permanent: true,
      },
      {
        source: "/services/request-help",
        destination: "/spreadsheet-solutions/request-help/",
        permanent: true,
      },
      {
        source: "/services/request-help/:path*",
        destination: "/spreadsheet-solutions/request-help/",
        permanent: true,
      },
      {
        source: "/services/request-template",
        destination: "/custom-templates/request-template/",
        permanent: true,
      },
      {
        source: "/services/request-template/:path*",
        destination: "/custom-templates/request-template/",
        permanent: true,
      },
      {
        source: "/services/request-tool",
        destination: "/custom-tools/request-tool/",
        permanent: true,
      },
      {
        source: "/services/request-tool/:path*",
        destination: "/custom-tools/request-tool/",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
