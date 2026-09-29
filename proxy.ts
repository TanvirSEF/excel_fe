import { type NextRequest, NextResponse } from "next/server"

const REFRESH_COOKIE = "ei_refresh"

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!request.cookies.has(REFRESH_COOKIE)) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("next", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")
  const isDev = process.env.NODE_ENV === "development"
  const apiUrl = process.env.API_URL ?? "https://api.excelinsider.com"
  const mediaHosts = (process.env.NEXT_PUBLIC_MEDIA_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean)
  const mediaHostCsp = mediaHosts.length
    ? mediaHosts.map((h) => `https://${h}`).join(" ")
    : ""

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob: https://i.ytimg.com ${mediaHostCsp};
    frame-src https://www.youtube-nocookie.com https://player.vimeo.com;
    connect-src 'self' ${apiUrl} https://vitals.vercel-insights.com${isDev ? " http://localhost:* ws://localhost:* wss://localhost:* webpack://" : ""};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    ${!isDev ? "upgrade-insecure-requests;" : ""}
  `
    .replace(/\s{2,}/g, " ")
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  requestHeaders.set("Content-Security-Policy", cspHeader)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set("Content-Security-Policy", cspHeader)

  return response
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
