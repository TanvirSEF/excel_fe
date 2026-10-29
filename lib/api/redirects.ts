import { config } from "@/lib/config"

export interface WpRedirect {
  old_path: string
  new_path: string
  redirect_type: number
}

const KNOWN_STATIC_PREFIXES = [
  "/_next",
  "/api",
  "/about",
  "/blog",
  "/calculator",
  "/calculators",
  "/categories",
  "/category",
  "/contact",
  "/dashboard",
  "/login",
  "/insider-studio",
  "/preview",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/newsletter",
  "/pricing",
  "/spreadsheet-solutions",
  "/custom-templates",
  "/custom-tools",
  "/privacy",
  "/privacy-policy",
  "/terms",
  "/terms-and-conditions",
  "/services",
  "/series",
  "/author",
  "/authors",
  "/cookie-policy",
]

export function looksLikeWpPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "/google-sheets") return false
  if (pathname.includes(".")) return false // assets (.png, .ico, .txt, etc.)
  for (const prefix of KNOWN_STATIC_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return false
    }
  }
  return true
}

export async function getWpRedirect(
  pathname: string
): Promise<WpRedirect | null> {
  const clean = pathname.replace(/^\/+|\/+$/g, "")
  if (!clean) return null
  try {
    const response = await fetch(
      `${config.apiUrl}/api/v1/redirects/${clean}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600, tags: ["redirects"] },
      }
    )
    if (!response.ok) return null
    return (await response.json()) as WpRedirect
  } catch {
    return null
  }
}
