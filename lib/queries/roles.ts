import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import { useAuthStore } from "@/lib/auth"
import type {
  PermissionGroup,
  RoleDetail,
  RolePermissionsUpdateInput,
  UserRole,
} from "@/types/api"

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => apiFetch<RoleDetail[]>("/roles"),
    staleTime: 60_000,
  })
}

export function usePermissionGroups() {
  return useQuery({
    queryKey: ["roles", "permissions"],
    queryFn: () => apiFetch<PermissionGroup[]>("/roles/permissions"),
    staleTime: Infinity,
  })
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      role,
      permissions,
    }: {
      role: UserRole
      permissions: string[]
    }) => {
      const payload: RolePermissionsUpdateInput = { permissions }
      return apiFetch<RoleDetail>(`/roles/${role}/permissions`, {
        method: "PUT",
        body: payload,
      })
    },
    onSuccess: (updatedRole) => {
      queryClient.setQueryData<RoleDetail[]>(["roles"], (current) =>
        current?.map((r) => (r.role === updatedRole.role ? updatedRole : r))
      )
      queryClient.invalidateQueries({ queryKey: ["roles"] })

      const { user, setUser } = useAuthStore.getState()
      if (user?.role === updatedRole.role) {
        setUser({ ...user, permissions: updatedRole.permissions })
      }
    },
  })
}
