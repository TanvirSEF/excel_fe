import type { NextConfig } from "next"

const apiUrl = process.env.API_URL ?? "https://api.excelinsider.com"

const mediaHosts = (process.env.NEXT_PUBLIC_MEDIA_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean)

const isDev = process.env.NODE_ENV === "development"

const cspValue = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https: data: blob:`,
  `style-src 'self' 'unsafe-inline' https:`,
  `font-src 'self' https: data:`,
  `img-src 'self' https: data: blob:`,
  `media-src 'self' https: data: blob:`,
  `frame-src 'self' https: data: blob:`,
  `worker-src 'self' blob: https:`,
  `child-src 'self' blob: https:`,
  `connect-src 'self' https: wss:${isDev ? " http://localhost:* ws://localhost:* webpack://" : ""}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  ...(!isDev ? [`upgrade-insecure-requests`] : []),
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspValue },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000,
    remotePatterns: mediaHosts.length
      ? [
          { protocol: "https" as const, hostname: "pub-b39c974f4c124a36a2fb517be38076ec.r2.dev" },
          ...mediaHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
        ]
      : [{ protocol: "https" as const, hostname: "**" }],
  },
  async headers() {
    return [
      {
        source: "/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|llms.txt|sitemap.xml|sitemap_index.xml).*)",
        headers: securityHeaders,
      },
      {
        source: "/(robots.txt|llms.txt)",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/(sitemap.xml|sitemap_index.xml)",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml; charset=utf-8",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:path*.(svg|jpg|jpeg|png|webp|ico|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/sitemap_index.xml",
        destination: `${apiUrl}/sitemap.xml`,
      },
      {
        source: "/sitemap.xml",
        destination: `${apiUrl}/sitemap.xml`,
      },
      {
        source: "/post-sitemap.xml",
        destination: `${apiUrl}/sitemap.xml`,
      },
      {
        source: "/page-sitemap.xml",
        destination: `${apiUrl}/sitemap.xml`,
      },
      {
        source: "/category-sitemap.xml",
        destination: `${apiUrl}/sitemap.xml`,
      },
      {
        source: "/author-sitemap.xml",
        destination: `${apiUrl}/sitemap.xml`,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/privacy",
        destination: "/privacy-policy/",
        permanent: true,
      },
      {
        source: "/privacy/:path*",
        destination: "/privacy-policy/",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-and-conditions/",
        permanent: true,
      },
      {
        source: "/terms/:path*",
        destination: "/terms-and-conditions/",
        permanent: true,
      },
      {
        source: "/categories",
        destination: "/category/",
        permanent: true,
      },
      {
        source: "/categories/:path*",
        destination: "/:path*/",
        permanent: true,
      },
      {
        source: "/blog/category/:path*",
        destination: "/:path*/",
        permanent: true,
      },
      {
        source: "/category/:slug/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/:slug/",
        permanent: true,
      },
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
