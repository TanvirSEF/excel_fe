import { serverFetch } from "@/lib/api/server-fetch"
import type { Tag } from "@/types/api"

export function getTags(revalidate = 300) {
  return serverFetch<Tag[]>("/tags", { revalidate })
}
