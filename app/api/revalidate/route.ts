import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

import { REFRESH_COOKIE } from "@/lib/api/auth-server"

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret")
  const hasAuthCookie = request.cookies.has(REFRESH_COOKIE)
  const authHeader = request.headers.get("authorization")
  const expectedSecret = process.env.REVALIDATE_SECRET

  const isAuthorized =
    hasAuthCookie ||
    Boolean(authHeader) ||
    (Boolean(expectedSecret) && secret === expectedSecret) ||
    process.env.NODE_ENV === "development"

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    path?: string
    slug?: string
    previousSlug?: string
    categorySlug?: string
    canonicalUrl?: string | null
    revalidateHome?: boolean
  }

  // 1. Invalidate Next.js Data Cache tags (serverFetch uses tags: ["post", slug])
  if (body.slug) {
    try {
      revalidateTag(body.slug, "max")
    } catch {
      // Non-blocking
    }
  }

  if (body.previousSlug) {
    try {
      revalidateTag(body.previousSlug, "max")
    } catch {
      // Non-blocking
    }
  }

  try {
    revalidateTag("post", "max")
    revalidateTag("posts", "max")
  } catch {
    // Non-blocking
  }

  const purge = (rawPath: string) => {
    if (!rawPath) return
    const normalized = rawPath.startsWith("/") ? rawPath : `/${rawPath}`
    try {
      revalidatePath(normalized, "page")
    } catch {
      // Non-blocking
    }
    try {
      revalidatePath(normalized)
    } catch {
      // Non-blocking
    }
    if (normalized.endsWith("/")) {
      const trimmed = normalized.replace(/\/+$/, "")
      if (trimmed) {
        try {
          revalidatePath(trimmed, "page")
        } catch {
          // Non-blocking
        }
        try {
          revalidatePath(trimmed)
        } catch {
          // Non-blocking
        }
      }
    } else {
      try {
        revalidatePath(`${normalized}/`, "page")
      } catch {
        // Non-blocking
      }
      try {
        revalidatePath(`${normalized}/`)
      } catch {
        // Non-blocking
      }
    }
  }

  if (body.path) {
    purge(body.path)
  }

  if (body.canonicalUrl) {
    purge(body.canonicalUrl)
  }

  if (body.slug) {
    purge(`/${body.slug}`)
    purge(`/blog/${body.slug}`)
    purge(`/google-sheets/${body.slug}`)
  }

  if (body.previousSlug) {
    purge(`/${body.previousSlug}`)
    purge(`/blog/${body.previousSlug}`)
    purge(`/google-sheets/${body.previousSlug}`)
  }

  if (body.categorySlug) {
    purge(`/${body.categorySlug}`)
    purge(`/category/${body.categorySlug}`)
  }

  if (body.categorySlug && body.slug) {
    purge(`/${body.categorySlug}/${body.slug}`)
  }

  if (body.revalidateHome) {
    purge("/")
    purge("/blog")
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
