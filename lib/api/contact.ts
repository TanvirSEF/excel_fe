import { apiFetch } from "@/lib/api/api-fetch"

export interface ContactMessagePayload {
  email: string
  subject: string
  service?: string | null
  message: string
}

export function submitContactMessage(payload: ContactMessagePayload) {
  return apiFetch<{ message: string }>("/contact", {
    method: "POST",
    body: payload,
  })
}
