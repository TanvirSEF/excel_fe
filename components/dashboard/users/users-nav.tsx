"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconShieldLock, IconUsers } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export function UsersNav() {
  const pathname = usePathname()

  const tabs = [
    {
      label: "Team Members",
      href: "/dashboard/users",
      icon: IconUsers,
      active: pathname === "/dashboard/users",
    },
    {
      label: "Roles & Permissions",
      href: "/dashboard/roles",
      icon: IconShieldLock,
      active: pathname.startsWith("/dashboard/roles"),
    },
  ]

  return (
    <div className="flex items-center gap-1 border-b pb-px">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3.5 py-2 text-sm font-medium transition-colors",
              tab.active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
