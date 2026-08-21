import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const REFRESH_COOKIE = "ei_refresh"

export function proxy(request: NextRequest) {
  if (!request.cookies.has(REFRESH_COOKIE)) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  const headers = new Headers(request.headers)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
