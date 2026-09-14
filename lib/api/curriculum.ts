import { serverFetch } from "@/lib/api/server-fetch"
import type { CurriculumModule } from "@/types/api"

export function getCurriculum(revalidate = 300) {
  return serverFetch<CurriculumModule[]>("/curriculum/google-sheets", {
    revalidate,
  })
}
