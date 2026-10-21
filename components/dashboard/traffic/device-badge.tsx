"use client"

import {
  IconBrandAndroid,
  IconBrandApple,
  IconBrandChrome,
  IconBrandEdge,
  IconBrandFirefox,
  IconBrandOpera,
  IconBrandSafari,
  IconBrandWindows,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconWorld,
} from "@tabler/icons-react"

interface DeviceBadgeProps {
  deviceType?: string | null
  browser?: string | null
  os?: string | null
}

export function DeviceBadge({ deviceType, browser, os }: DeviceBadgeProps) {
  const getDeviceIcon = () => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <IconDeviceMobile className="h-4 w-4 text-emerald-500" />
      case "tablet":
        return <IconDeviceTablet className="h-4 w-4 text-violet-500" />
      case "desktop":
      default:
        return <IconDeviceDesktop className="h-4 w-4 text-blue-500" />
    }
  }

  const getOsIcon = () => {
    const o = os?.toLowerCase() || ""
    if (o.includes("win")) return <IconBrandWindows className="h-3.5 w-3.5 text-sky-500" />
    if (o.includes("mac") || o.includes("ios") || o.includes("apple")) {
      return <IconBrandApple className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
    }
    if (o.includes("android")) return <IconBrandAndroid className="h-3.5 w-3.5 text-emerald-500" />
    return null
  }

  const getBrowserIcon = () => {
    const b = browser?.toLowerCase() || ""
    if (b.includes("chrome")) return <IconBrandChrome className="h-3.5 w-3.5 text-amber-500" />
    if (b.includes("safari")) return <IconBrandSafari className="h-3.5 w-3.5 text-blue-500" />
    if (b.includes("firefox")) return <IconBrandFirefox className="h-3.5 w-3.5 text-orange-500" />
    if (b.includes("edge")) return <IconBrandEdge className="h-3.5 w-3.5 text-teal-500" />
    if (b.includes("opera")) return <IconBrandOpera className="h-3.5 w-3.5 text-red-500" />
    return <IconWorld className="h-3.5 w-3.5 text-muted-foreground" />
  }

  const deviceLabel = deviceType
    ? deviceType.charAt(0).toUpperCase() + deviceType.slice(1)
    : "Desktop"

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/60" title={deviceLabel}>
        {getDeviceIcon()}
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1 font-medium text-foreground">
          {getBrowserIcon()}
          <span className="truncate max-w-28">{browser || "Unknown"}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          {getOsIcon()}
          <span className="truncate max-w-28">{os || deviceLabel}</span>
        </div>
      </div>
    </div>
  )
}
