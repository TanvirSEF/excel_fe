import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import type { Page, User, UserRole } from "@/types/api"

export function useUsers(page: number) {
  return useQuery({
    queryKey: ["users", page],
    queryFn: () =>
      apiFetch<Page<User>>("/users", {
        searchParams: { page, page_size: 10 },
      }),
  })
}

export interface UserUpdateInput {
  name?: string
  avatar_url?: string | null
  bio?: string | null
  role?: UserRole
  is_active?: boolean
  is_verified?: boolean
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      input,
    }: {
      userId: string
      input: UserUpdateInput
    }) =>
      apiFetch<User>(`/users/${userId}`, { method: "PATCH", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch<{ message: string }>(`/users/${userId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
      role,
    }: {
      name: string
      email: string
      password: string
      role: UserRole
    }) =>
      apiFetch<User>("/auth/register", {
        method: "POST",
        body: { name, email, password, role },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
