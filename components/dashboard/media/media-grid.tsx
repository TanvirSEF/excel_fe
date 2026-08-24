"use client"

import Image from "next/image"

import { Skeleton } from "@/components/ui/skeleton"
import type { MediaItem } from "@/types/api"

export function isImageFile(fileType: string): boolean {
  return fileType === "image" || fileType.startsWith("image/")
}

interface MediaGridProps {
  items: MediaItem[] | undefined
  isPending: boolean
  onSelect: (item: MediaItem) => void
}

export function MediaGrid({ items, isPending, onSelect }: MediaGridProps) {
  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square rounded-xl" />
        ))}
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
        No files in this folder yet.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className="group overflow-hidden rounded-xl border text-left transition-colors hover:border-primary/50"
        >
          <div className="relative aspect-square bg-muted">
            {isImageFile(item.file_type) ? (
              <Image
                src={item.file_url}
                alt={item.alt_text ?? item.file_url}
                fill
                priority={index < 4}
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                {item.file_type}
              </span>
            )}
          </div>
          <div className="space-y-0.5 px-2.5 py-2">
            <p className="truncate text-xs font-medium">{item.alt_text || item.file_url.split("/").pop()}</p>
            <p className="text-xs text-muted-foreground">
              {item.width && item.height ? `${item.width}×${item.height}` : ""}
              {item.size_kb ? ` · ${Math.round(item.size_kb)} KB` : ""}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
