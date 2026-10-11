import { NextResponse } from "next/server"

import { config } from "@/lib/config"

export const revalidate = 86400

const FALLBACK_ADS_TXT = `# Mediavine Ads.txt
managerdomain=mediavine.com
contact=sales@mediavine.com
ownerdomain=excelinsider.com
mediavine.com, c63b509548636d4223348b8ec254efcb, DIRECT, 1363c924529b3998
aps.amazon.com, 38918095-8e45-4332-88bf-226b3514cb64, DIRECT
google.com, pub-1601477034266482, DIRECT, f08c47fec0942fa0
google.com, pub-1601477034266482, RESELLER, f08c47fec0942fa0
`

export async function GET() {
  const url = `https://adstxt.mediavine.com/sites/${config.mediavineTagId}/ads.txt`

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: {
        "User-Agent": "ExcelInsider-AdsTxt-Fetcher/1.0",
      },
    })

    if (res.ok) {
      const text = await res.text()
      if (text.includes("mediavine.com")) {
        return new NextResponse(text, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
          },
        })
      }
    }
  } catch {
    // Return fallback if upstream is unreachable
  }

  return new NextResponse(FALLBACK_ADS_TXT, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
