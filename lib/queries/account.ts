import { useMutation } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) =>
      apiFetch<{ message: string }>("/auth/change-password", {
        method: "POST",
        body: {
          current_password: currentPassword,
          new_password: newPassword,
        },
      }),
  })
}

export function useRequestVerification() {
  return useMutation({
    mutationFn: () =>
      apiFetch<{ message: string }>("/auth/verify-email/request", {
        method: "POST",
      }),
  })
}
