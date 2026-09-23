"use client"

import { useState } from "react"
import { IconPlayerPlay } from "@tabler/icons-react"

import { parseVideoInfo } from "@/lib/embed"
import { cn } from "@/lib/utils"

interface VideoEmbedProps {
  url: string
  caption?: string
  title?: string
  className?: string
}

export function VideoEmbed({ url, caption, title, className }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const video = parseVideoInfo(url)

  if (!video) return null

  const isYouTube = video.provider === "youtube"
  const autoplayEmbedUrl = isYouTube
    ? `${video.embedUrl}${video.embedUrl.includes("?") ? "&" : "?"}autoplay=1`
    : video.embedUrl

  return (
    <figure className={cn("my-6", className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted shadow-2xs">
        {isYouTube && !isPlaying ? (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play video: ${title || caption || "YouTube video"}`}
            className="group relative flex h-full w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {video.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={video.thumbnailUrl}
                alt={title || caption || "Video thumbnail"}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : null}

            <div className="absolute inset-0 bg-black/25 transition-colors duration-200 group-hover:bg-black/15" />

            <div className="absolute flex h-12 w-16 items-center justify-center rounded-2xl bg-red-600/90 text-white shadow-xl transition-all duration-200 group-hover:scale-110 group-hover:bg-red-600 group-active:scale-95 sm:h-14 sm:w-20">
              <IconPlayerPlay className="h-6 w-6 fill-white text-white translate-x-0.5 sm:h-7 sm:w-7" />
            </div>
          </button>
        ) : (
          <iframe
            src={autoplayEmbedUrl}
            title={title || caption || "Embedded video"}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>

      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
