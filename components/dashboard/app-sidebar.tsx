"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChartBar,
  IconDashboard,
  IconFileText,
  IconHistory,
  IconMessage,
  IconPhoto,
  IconTags,
  IconUsers,
} from "@tabler/icons-react"

import { NavUser } from "@/components/dashboard/nav-user"
import {
  SidebarNav,
  SidebarNavSkeleton,
  type NavItem,
} from "@/components/dashboard/sidebar-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { can, useAuthStore } from "@/lib/auth"

const CONTENT_ITEMS: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: IconDashboard, permission: "overview:view" },
  { title: "Posts", url: "/dashboard/posts", icon: IconFileText, permission: "posts:view" },
  { title: "Comments", url: "/dashboard/comments", icon: IconMessage, permission: "comments:moderate" },
  { title: "Media", url: "/dashboard/media", icon: IconPhoto, permission: "media:view" },
  { title: "Categories", url: "/dashboard/categories", icon: IconTags, permission: "categories:manage" },
  { title: "Tags", url: "/dashboard/tags", icon: IconTags, permission: "tags:view" },
]

const INSIGHT_ITEMS: NavItem[] = [
  { title: "Analytics", url: "/dashboard/analytics", icon: IconChartBar, permission: "analytics:view" },
]

const ADMIN_ITEMS: NavItem[] = [
  { title: "Users", url: "/dashboard/users", icon: IconUsers, permission: "users:manage" },
  { title: "Audit logs", url: "/dashboard/audit-logs", icon: IconHistory, permission: "audit:view" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)

  const loading = status === "loading"

  const contentItems = CONTENT_ITEMS.filter((item) => can(user, item.permission))
  const insightItems = INSIGHT_ITEMS.filter((item) => can(user, item.permission))
  const adminItems = ADMIN_ITEMS.filter((item) => can(user, item.permission))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  EI
                </span>
                <span className="text-base font-semibold">Excel Insider</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {loading ? (
          <>
            <SidebarNavSkeleton rows={4} />
            <SidebarNavSkeleton rows={2} />
          </>
        ) : (
          <>
            <SidebarNav label="Content" items={contentItems} />
            {insightItems.length > 0 ? (
              <SidebarNav label="Insights" items={insightItems} />
            ) : null}
            {adminItems.length > 0 ? (
              <SidebarNav label="Administration" items={adminItems} className="mt-auto" />
            ) : null}
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
