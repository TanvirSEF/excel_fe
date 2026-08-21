"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { isImageFile } from "@/components/dashboard/media/media-grid"
import { ApiClientError } from "@/lib/api/error"
import { useMediaFolders, useMediaList, useUploadMedia } from "@/lib/queries/media"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/types/api"

interface MediaPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (item: MediaItem) => void
}

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
}: MediaPickerProps) {
  const [folder, setFolder] = useState<string | null>(null)
  const { data, isPending } = useMediaList({
    folder: folder ?? undefined,
    page: 1,
    page_size: 40,
  })
  const { data: folders } = useMediaFolders()
  const uploadMedia = useUploadMedia()

  const items = (data?.items ?? []).filter((item) =>
    isImageFile(item.file_type)
  )

  async function onUpload(file: File) {
    try {
      const uploaded = await uploadMedia.mutateAsync({
        file,
        folder: folder ?? undefined,
      })
      toast.success("File uploaded.")
      if (isImageFile(uploaded.file_type)) {
        onSelect(uploaded)
        onOpenChange(false)
      }
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Upload failed. Please try again."
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Media library</SheetTitle>
          <SheetDescription>
            Pick an image or upload a new one.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) onUpload(file)
                  event.target.value = ""
                }}
              />
              <span className="inline-flex h-8 items-center rounded-md border border-input bg-background px-3 text-xs font-medium transition-colors hover:bg-accent">
                {uploadMedia.isPending ? "Uploading…" : "Upload image"}
              </span>
            </label>
            <button
              type="button"
              onClick={() => setFolder(null)}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition-colors",
                folder === null
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              All
            </button>
            {(folders ?? []).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setFolder(name)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs transition-colors",
                  folder === name
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                {name}
              </button>
            ))}
          </div>

          {isPending ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Loading…
            </p>
          ) : items.length === 0 ? (
            <p className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
              No images yet — upload one above.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  title={item.alt_text ?? ""}
                  onClick={() => {
                    onSelect(item)
                    onOpenChange(false)
                  }}
                  className="group relative aspect-square overflow-hidden rounded-lg border transition-colors hover:border-primary"
                >
                  <Image
                    src={item.file_url}
                    alt={item.alt_text ?? ""}
                    fill
                    sizes="(max-width: 640px) 33vw, 160px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Need an exact size or external image? Paste its URL in the field
            instead.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
