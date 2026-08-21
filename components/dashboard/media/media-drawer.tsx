"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"

import { isImageFile } from "@/components/dashboard/media/media-grid"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Time } from "@/components/shared/time"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ApiClientError } from "@/lib/api/error"
import { can, useAuthStore } from "@/lib/auth"
import { useDeleteMedia, useUpdateMedia } from "@/lib/queries/media"
import type { MediaItem } from "@/types/api"

interface MediaDrawerProps {
  item: MediaItem | null
  onClose: () => void
  onDeleted?: () => void
}

export function MediaDrawer({ item, onClose, onDeleted }: MediaDrawerProps) {
  const user = useAuthStore((state) => state.user)
  const updateMedia = useUpdateMedia()
  const deleteMedia = useDeleteMedia()
  const [altText, setAltText] = useState("")
  const [folder, setFolder] = useState("")
  const [touched, setTouched] = useState(false)
  const [loadedFor, setLoadedFor] = useState<string | null>(null)

  const canEdit = can(user, "media:manage") || can(user, "media:upload")
  const canDelete = can(user, "media:manage")

  if (item && loadedFor !== item.id) {
    setLoadedFor(item.id)
    setAltText(item.alt_text ?? "")
    setFolder(item.folder)
    setTouched(false)
  }

  async function onSave() {
    if (!item) return
    try {
      await updateMedia.mutateAsync({
        mediaId: item.id,
        input: {
          alt_text: altText.trim() || undefined,
          folder: folder.trim(),
        },
      })
      toast.success("File updated.")
      setTouched(false)
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not update. Please try again."
      )
    }
  }

  async function onDelete() {
    if (!item) return
    try {
      await deleteMedia.mutateAsync(item.id)
      toast.success("File deleted.")
      onClose()
      onDeleted?.()
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not delete. Please try again."
      )
    }
  }

  async function copyUrl() {
    if (!item) return
    try {
      await navigator.clipboard.writeText(item.file_url)
      toast.success("URL copied.")
    } catch {
      toast.error("Could not copy the URL.")
    }
  }

  return (
    <Sheet open={item !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {item ? (
          <>
            <SheetHeader>
              <SheetTitle className="truncate pr-6">
                {item.alt_text || item.file_url.split("/").pop()}
              </SheetTitle>
              <SheetDescription>
                Uploaded <Time date={item.created_at} variant="full" />
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-6">
              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                {isImageFile(item.file_type) ? (
                  <Image
                    src={item.file_url}
                    alt={item.alt_text ?? ""}
                    fill
                    sizes="(max-width: 640px) 100vw, 448px"
                    className="object-contain"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    {item.file_type}
                  </span>
                )}
              </div>

              <dl className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <dt>Type</dt>
                  <dd className="font-mono">{item.file_type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Dimensions</dt>
                  <dd>
                    {item.width && item.height
                      ? `${item.width}×${item.height}`
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Size</dt>
                  <dd>{item.size_kb ? `${Math.round(item.size_kb)} KB` : "—"}</dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={copyUrl}>
                  Copy URL
                </Button>
                {canDelete ? (
                  <ConfirmDialog
                    trigger={
                      <Button type="button" variant="outline" size="sm">
                        Delete
                      </Button>
                    }
                    title={`Delete "${item.alt_text || item.file_url.split("/").pop()}"?`}
                    description="Articles using this file will lose the image."
                    confirmLabel="Delete"
                    onConfirm={onDelete}
                  />
                ) : null}
              </div>

              {canEdit ? (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="media-alt">Alt text</Label>
                    <Input
                      id="media-alt"
                      value={altText}
                      onChange={(event) => {
                        setAltText(event.target.value)
                        setTouched(true)
                      }}
                      placeholder="Describe the image"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-folder">Folder</Label>
                    <Input
                      id="media-folder"
                      value={folder}
                      onChange={(event) => {
                        setFolder(event.target.value)
                        setTouched(true)
                      }}
                      placeholder="e.g. blog"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={onSave}
                    disabled={updateMedia.isPending || !touched}
                  >
                    {updateMedia.isPending ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
