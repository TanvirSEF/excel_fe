"use client"

import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandX,
  IconLink,
} from "@tabler/icons-react"
import { toast } from "sonner"

interface ShareButtonsProps {
  title: string
}

const SHARE_TARGETS = [
  {
    label: "Share on Facebook",
    icon: IconBrandFacebook,
    hover: "hover:bg-[#1877F2] hover:border-[#1877F2]",
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "Share on X (Twitter)",
    icon: IconBrandX,
    hover: "hover:bg-foreground hover:border-foreground hover:text-background",
    href: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    label: "Share on LinkedIn",
    icon: IconBrandLinkedin,
    hover: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
    href: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
]

export function ShareButtons({ title }: ShareButtonsProps) {
  function openShare(href: string) {
    window.open(href, "_blank", "noopener,noreferrer,width=640,height=540")
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    } catch {
      toast.error("Could not copy the link. Please try again.")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Share
      </span>
      {SHARE_TARGETS.map((target) => {
        const Icon = target.icon
        return (
          <button
            key={target.label}
            type="button"
            aria-label={target.label}
            title={target.label}
            onClick={() => openShare(target.href(window.location.href, title))}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:text-white hover:shadow-sm ${target.hover}`}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
      <button
        type="button"
        aria-label="Copy link"
        title="Copy link"
        onClick={copyLink}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-sm"
      >
        <IconLink className="h-4 w-4" />
      </button>
    </div>
  )
}
