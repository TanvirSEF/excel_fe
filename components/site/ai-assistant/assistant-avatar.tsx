import Image from "next/image"
import { cn } from "@/lib/utils"

interface AssistantAvatarProps {
  className?: string
  src?: string
  alt?: string
}

export function AssistantAvatar({
  className = "h-8 w-8",
  src = "/images/assistant-avatar.gif",
  alt = "SheetBuddy Mascot",
}: AssistantAvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-emerald-500/25 bg-emerald-50/50 dark:bg-emerald-950/30 transition-transform duration-200 group-hover:scale-105",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={64}
        height={64}
        unoptimized
        priority
        className="h-full w-full object-contain select-none pointer-events-none"
      />
    </div>
  )
}
