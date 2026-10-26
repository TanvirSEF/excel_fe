import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const REFRESH_COOKIE = "ei_refresh"

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (!pathname.startsWith("/dashboard")) {
    const page = Number(searchParams.get("page"))
    const target = request.nextUrl.clone()
    target.pathname = `${pathname.replace(/\/+$/, "")}/page/${page}/`
    target.search = ""
    return NextResponse.redirect(target, 308)
  }

  if (!request.cookies.has(REFRESH_COOKIE)) {
    const loginUrl = new URL("/insider-studio", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const headers = new Headers(request.headers)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    {
      source: "/((?!blog|author|tags|search|dashboard|api|_next).+)",
      has: [{ type: "query", key: "page", value: "(?<page>[2-9]|[1-9]\\d+)" }],
    },
  ],
}
