import type { MetadataRoute } from "next"

import { config } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/dashboard",
          "/api/",
          "/api",
          "/preview/",
          "/preview",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/search",
          "/newsletter/unsubscribe",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "ClaudeBot",
          "Bytespider",
          "AhrefsBot",
          "SemrushBot",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: [
      `${config.siteUrl}/sitemap_index.xml`,
      `${config.siteUrl}/sitemap.xml`,
    ],
  }
}
