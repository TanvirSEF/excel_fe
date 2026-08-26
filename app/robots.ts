import type { MetadataRoute } from "next"

import { config } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/api",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/newsletter/unsubscribe",
        ],
      },
    ],
    sitemap: `${config.siteUrl}/sitemap.xml`,
  }
}
