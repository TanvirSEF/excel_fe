"use client"

import { useState } from "react"
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconBrandX,
  IconCheck,
  IconLink,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

interface ShareButtonsProps {
  title: string
  className?: string
}

const SHARE_TARGETS = [
  {
    label: "Facebook",
    icon: IconBrandFacebook,
    className:
      "bg-[#1877F2] text-white hover:bg-[#1464c9] shadow-xs shadow-[#1877F2]/25",
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "X (Twitter)",
    icon: IconBrandX,
    className:
      "bg-black text-white ring-1 ring-white/20 hover:bg-neutral-900 shadow-xs shadow-black/25",
    href: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    label: "LinkedIn",
    icon: IconBrandLinkedin,
    className:
      "bg-[#0A66C2] text-white hover:bg-[#084e96] shadow-xs shadow-[#0A66C2]/25",
    href: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: "Pinterest",
    icon: IconBrandPinterest,
    className:
      "bg-[#E60023] text-white hover:bg-[#c5001e] shadow-xs shadow-[#E60023]/25",
    href: (url: string, title: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
  },
]

export function ShareButtons({ title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  function openShare(href: string) {
    window.open(href, "_blank", "noopener,noreferrer,width=640,height=540")
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy the link. Please try again.")
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Share
      </span>
      {SHARE_TARGETS.map((target) => {
        const Icon = target.icon
        return (
          <button
            key={target.label}
            type="button"
            aria-label={`Share on ${target.label}`}
            title={`Share on ${target.label}`}
            onClick={() => openShare(target.href(window.location.href, title))}
            className={cn(
              "flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95",
              target.className
            )}
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
        className={cn(
          "flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95",
          copied && "border-primary bg-primary text-primary-foreground"
        )}
      >
        {copied ? (
          <IconCheck className="h-4 w-4 text-primary" />
        ) : (
          <IconLink className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
