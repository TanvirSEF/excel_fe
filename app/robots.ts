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
        userAgent: ["GPTBot", "CCBot", "ClaudeBot", "Bytespider"],
        allow: ["/llms.txt", "/.well-known/ard.json"],
        disallow: ["/"],
      },
    ],
    sitemap: `${config.siteUrl}/sitemap.xml`,
  }
}
