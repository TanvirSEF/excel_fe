import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import type {
  PermissionGroup,
  RoleDetail,
  RolePermissionsUpdateInput,
  UserRole,
} from "@/types/api"

export const DEFAULT_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "content",
    title: "Posts & Editorial",
    description:
      "Article authoring, reviewing, scheduling, and deletion capabilities.",
    permissions: [
      {
        id: "posts:view",
        name: "View Posts",
        description: "View all articles, drafts, and editorial revisions.",
      },
      {
        id: "posts:manage",
        name: "Manage Posts",
        description:
          "Create and edit articles, headings, formulas, and content blocks.",
      },
      {
        id: "posts:publish",
        name: "Publish Posts",
        description:
          "Publish drafts, schedule release dates, or unpublish live posts.",
      },
      {
        id: "posts:delete",
        name: "Delete Posts",
        description: "Move articles to trash or permanently remove posts.",
      },
    ],
  },
  {
    id: "seo",
    title: "SEO & Metadata",
    description: "Search engine optimization and structured schema markup.",
    permissions: [
      {
        id: "seo:edit",
        name: "Edit SEO Metadata",
        description:
          "Edit meta titles, descriptions, canonical URLs, and schema markup types.",
      },
    ],
  },
  {
    id: "taxonomy",
    title: "Taxonomy & Organization",
    description: "Management of article categories, topics, and taxonomy tags.",
    permissions: [
      {
        id: "categories:manage",
        name: "Manage Categories",
        description: "Create, edit, sort, and organize article categories.",
      },
      {
        id: "tags:view",
        name: "View Tags",
        description: "Browse and search the global tags directory.",
      },
      {
        id: "tags:create",
        name: "Create Tags",
        description: "Create new tags during post creation or tag editing.",
      },
      {
        id: "tags:manage",
        name: "Manage Tags",
        description: "Edit, merge, cleanup, and delete existing tags.",
      },
    ],
  },
  {
    id: "media",
    title: "Media & Assets",
    description: "Image gallery, spreadsheets, and file asset administration.",
    permissions: [
      {
        id: "media:view",
        name: "View Media Library",
        description: "Browse uploaded screenshots, illustrations, and assets.",
      },
      {
        id: "media:upload",
        name: "Upload Media",
        description:
          "Upload new image files, spreadsheets, and assets to cloud storage.",
      },
      {
        id: "media:manage",
        name: "Manage Media",
        description:
          "Edit image alt text, replace assets, and delete media files.",
      },
    ],
  },
  {
    id: "community",
    title: "Community & Moderation",
    description: "Reader feedback, user discussions, and comment moderation.",
    permissions: [
      {
        id: "comments:moderate",
        name: "Moderate Comments",
        description:
          "Approve, reject, flag as spam, or delete reader comments.",
      },
    ],
  },
  {
    id: "analytics",
    title: "Insights & Analytics",
    description: "Website traffic, search impressions, and editorial metrics.",
    permissions: [
      {
        id: "overview:view",
        name: "View Overview",
        description:
          "Access dashboard overview cards and performance summaries.",
      },
      {
        id: "analytics:view",
        name: "View Analytics",
        description:
          "Inspect Google Analytics traffic, referral sources, and post views.",
      },
    ],
  },
  {
    id: "administration",
    title: "System & Administration",
    description:
      "High-level access control, user accounts, and audit logging.",
    permissions: [
      {
        id: "users:manage",
        name: "Manage Users",
        description:
          "Invite, edit, reassign roles, and deactivate team accounts.",
      },
      {
        id: "audit:view",
        name: "View Audit Logs",
        description:
          "Inspect security audit trails and administrative change logs.",
      },
      {
        id: "settings:view",
        name: "View Settings",
        description: "Access settings and personal profile preferences.",
      },
      {
        id: "settings:manage",
        name: "Manage Settings",
        description:
          "Configure system-wide settings, WordPress imports, and site backups.",
      },
    ],
  },
]

export const DEFAULT_ROLES: RoleDetail[] = [
  {
    role: "super_admin",
    name: "Super Admin",
    description:
      "Full administrative control over all system modules, team members, role permissions, audit trails, and platform configurations.",
    member_count: 1,
    is_system: true,
    is_editable: false,
    permissions: ["*"],
  },
  {
    role: "senior_editor",
    name: "Senior Editor",
    description:
      "Editorial authority to author, review, schedule, publish, or remove posts, assign authors, manage SEO metadata, and moderate comments.",
    member_count: 0,
    is_system: true,
    is_editable: true,
    permissions: [
      "overview:view",
      "posts:view",
      "posts:manage",
      "posts:delete",
      "posts:publish",
      "seo:edit",
      "comments:moderate",
      "media:view",
      "media:manage",
      "categories:manage",
      "tags:view",
      "tags:manage",
      "analytics:view",
      "settings:view",
    ],
  },
  {
    role: "technical_writer",
    name: "Technical Writer",
    description:
      "Content creator focused on authoring, drafting, and updating assigned technical spreadsheet tutorials and uploading media assets.",
    member_count: 0,
    is_system: true,
    is_editable: true,
    permissions: [
      "overview:view",
      "posts:view",
      "posts:manage",
      "media:view",
      "media:upload",
      "tags:view",
      "tags:create",
      "settings:view",
    ],
  },
  {
    role: "seo_specialist",
    name: "SEO Specialist",
    description:
      "Search strategist responsible for metadata optimization, focus keyphrases, structured schema markup, and performance analytics.",
    member_count: 0,
    is_system: true,
    is_editable: true,
    permissions: [
      "overview:view",
      "seo:edit",
      "analytics:view",
      "settings:view",
    ],
  },
]

const LOCAL_STORAGE_KEY = "excel_insider_custom_role_permissions"

export function getStoredRolePermissions(): Record<string, string[]> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function storeRolePermissions(role: string, perms: string[]) {
  if (typeof window === "undefined") return
  try {
    const current = getStoredRolePermissions() ?? {}
    current[role] = perms
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current))
  } catch {
    // ignore
  }
}

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        const roles = await apiFetch<RoleDetail[]>("/roles")
        // Cache to localStorage for offline / cross-component sync
        roles.forEach((r) => storeRolePermissions(r.role, r.permissions))
        return roles
      } catch {
        // Return default roles merged with any saved overrides
        const stored = getStoredRolePermissions()
        if (stored) {
          return DEFAULT_ROLES.map((r) => ({
            ...r,
            permissions: stored[r.role] ?? r.permissions,
          }))
        }
        return DEFAULT_ROLES
      }
    },
    staleTime: 60_000,
  })
}

export function usePermissionGroups() {
  return useQuery({
    queryKey: ["roles", "permissions"],
    queryFn: async () => {
      try {
        return await apiFetch<PermissionGroup[]>("/roles/permissions")
      } catch {
        return DEFAULT_PERMISSION_GROUPS
      }
    },
    staleTime: Infinity,
  })
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      role,
      permissions,
    }: {
      role: UserRole
      permissions: string[]
    }) => {
      const payload: RolePermissionsUpdateInput = { permissions }
      try {
        const res = await apiFetch<RoleDetail>(`/roles/${role}/permissions`, {
          method: "PUT",
          body: payload,
        })
        storeRolePermissions(role, res.permissions)
        return res
      } catch (err) {
        // If backend endpoint is temporarily unreachable, persist locally
        storeRolePermissions(role, permissions)
        const roleMeta = DEFAULT_ROLES.find((r) => r.role === role)
        if (roleMeta) {
          return {
            ...roleMeta,
            permissions,
          }
        }
        throw err
      }
    },
    onSuccess: (updatedRole) => {
      queryClient.setQueryData<RoleDetail[]>(["roles"], (current) => {
        if (!current) return [updatedRole]
        return current.map((r) =>
          r.role === updatedRole.role ? { ...r, permissions: updatedRole.permissions } : r
        )
      })
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
  })
}
