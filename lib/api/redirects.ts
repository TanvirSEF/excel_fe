import { config } from "@/lib/config"

export interface WpRedirect {
  old_path: string
  new_path: string
  redirect_type: number
}

export function looksLikeWpPath(pathname: string): boolean {
  if (/^\/\d{4}\/\d{2}(\/|$)/.test(pathname)) return true
  if (pathname.startsWith("/category/")) return true
  if (pathname.startsWith("/tag/")) return true
  if (pathname.startsWith("/wp-content/") || pathname.startsWith("/wp-login")) {
    return true
  }
  return false
}

export async function getWpRedirect(
  pathname: string
): Promise<WpRedirect | null> {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/v1/redirects/${pathname.replace(/^\//, "")}`,
      { next: { revalidate: 300, tags: ["redirects"] } }
    )
    if (!response.ok) return null
    return (await response.json()) as WpRedirect
  } catch {
    return null
  }
}
