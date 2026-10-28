import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

import { REFRESH_COOKIE } from "@/lib/api/auth-server"

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret")
  const hasAuthCookie = request.cookies.has(REFRESH_COOKIE)
  const expectedSecret = process.env.REVALIDATE_SECRET

  const isAuthorized =
    hasAuthCookie ||
    (Boolean(expectedSecret) && secret === expectedSecret) ||
    process.env.NODE_ENV === "development"

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    path?: string
    slug?: string
    categorySlug?: string
    revalidateHome?: boolean
  }

  if (body.path) {
    revalidatePath(body.path)
    if (!body.path.endsWith("/")) {
      revalidatePath(`${body.path}/`)
    }
  }

  if (body.slug) {
    revalidatePath(`/${body.slug}`)
    revalidatePath(`/${body.slug}/`)
  }

  if (body.categorySlug) {
    revalidatePath(`/${body.categorySlug}`)
    revalidatePath(`/${body.categorySlug}/`)
  }

  if (body.categorySlug && body.slug) {
    revalidatePath(`/${body.categorySlug}/${body.slug}`)
    revalidatePath(`/${body.categorySlug}/${body.slug}/`)
  }

  if (body.revalidateHome) {
    revalidatePath("/")
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
