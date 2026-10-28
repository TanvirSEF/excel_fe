import { serverFetch } from "@/lib/api/server-fetch"
import type { AuthorProfile } from "@/types/api"

export function getAuthor(id: string, revalidate = 86400) {
  return serverFetch<AuthorProfile>(`/authors/${encodeURIComponent(id)}`, {
    revalidate,
    tags: ["author", id],
  })
}
