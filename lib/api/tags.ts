import { serverFetch } from "@/lib/api/server-fetch"
import type { Tag } from "@/types/api"

export function getTags(revalidate = 86400) {
  return serverFetch<Tag[]>("/tags", { revalidate, tags: ["tags"] })
}
