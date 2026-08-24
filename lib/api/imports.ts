import { useAuthStore } from "@/lib/auth"
import { API_BASE_PATH, config } from "@/lib/config"
import type { WpImportResult } from "@/types/api"

export async function runWordPressImport(
  file: File,
  dryRun: boolean,
  includeImages: boolean,
): Promise<WpImportResult> {
  const url = new URL(
    `${config.publicApiUrl}${API_BASE_PATH}/imports/wordpress`,
  )
  url.searchParams.set("dry_run", String(dryRun))
  url.searchParams.set("include_images", String(includeImages))

  const form = new FormData()
  form.append("file", file)

  const headers: Record<string, string> = {}
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(url, { method: "POST", headers, body: form })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error?.message ?? "Import failed")
  }

  return response.json() as Promise<WpImportResult>
}
