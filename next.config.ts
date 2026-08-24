import type { NextConfig } from "next"

const apiUrl = process.env.API_URL ?? "https://api.excelinsider.com"

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
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
