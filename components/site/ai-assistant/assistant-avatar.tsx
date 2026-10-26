import Image from "next/image"
import { cn } from "@/lib/utils"

interface AssistantAvatarProps {
  className?: string
  src?: string
  alt?: string
}

export function AssistantAvatar({
  className = "h-12 w-12",
  src = "/images/assistant-avatar.webp",
  alt = "Cellie Mascot",
}: AssistantAvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center select-none transition-transform duration-300 group-hover:scale-108 group-hover:-translate-y-1",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={96}
        height={96}
        unoptimized
        className="h-full w-full object-contain drop-shadow-md select-none pointer-events-none"
      />
    </div>
  )
}
