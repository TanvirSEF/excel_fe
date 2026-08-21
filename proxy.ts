import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
