import type { MetadataRoute } from "next"

import { config } from "@/lib/config"

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/blog", "/categories"].map((path) => ({
    url: `${config.siteUrl}${path}`,
    lastModified: new Date(),
  }))
}
