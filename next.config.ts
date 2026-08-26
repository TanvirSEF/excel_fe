import type { NextConfig } from "next"

const apiUrl = process.env.API_URL ?? "https://api.excelinsider.com"

const mediaHosts = (process.env.NEXT_PUBLIC_MEDIA_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean)

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
}

export default nextConfig
