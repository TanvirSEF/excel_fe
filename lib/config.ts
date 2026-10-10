export const config = {
  apiUrl: process.env.API_URL ?? "https://api.excelinsider.com",
  publicApiUrl: process.env.NEXT_PUBLIC_API_URL ?? "https://api.excelinsider.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://excelinsider.com",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-4GNYFJ4823",
  mediavineTagId: process.env.NEXT_PUBLIC_MEDIAVINE_TAG_ID ?? "b7f57ae8-25c1-458d-9569-620b15a27933",
} as const

export const API_BASE_PATH = "/api/v1"
