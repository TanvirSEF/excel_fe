import { NextRequest, NextResponse } from "next/server"

import { API_BASE_PATH, config } from "@/lib/config"

interface RouteProps {
  params: Promise<{ slug: string }>
}

export async function POST(request: NextRequest, { params }: RouteProps) {
  const { slug } = await params
  if (!slug) {
    return new NextResponse(null, { status: 400 })
  }

  const clientIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    ""

  const cfCountry = request.headers.get("cf-ipcountry") || ""
  const cfCity = request.headers.get("cf-ipcity") || ""
  const userAgent = request.headers.get("user-agent") || ""
  const referer = request.headers.get("referer") || ""

  const backendUrl = `${config.apiUrl}${API_BASE_PATH}/posts/${encodeURIComponent(slug)}/view`

  const headers: Record<string, string> = {
    Accept: "application/json",
  }
  if (clientIp) {
    headers["x-forwarded-for"] = clientIp
    headers["cf-connecting-ip"] = clientIp
  }
  if (cfCountry) headers["cf-ipcountry"] = cfCountry
  if (cfCity) headers["cf-ipcity"] = cfCity
  if (userAgent) headers["user-agent"] = userAgent
  if (referer) headers["referer"] = referer

  try {
    await fetch(backendUrl, {
      method: "POST",
      headers,
      cache: "no-store",
    })
  } catch {
    // Fail silently so client beacon never produces errors
  }

  return new NextResponse(null, { status: 204 })
}
