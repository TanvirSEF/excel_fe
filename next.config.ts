import type { NextConfig } from "next"

const apiUrl = process.env.API_URL ?? "https://api.excelinsider.com"

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
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
