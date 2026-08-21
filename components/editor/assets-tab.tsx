"use client"

import { useRef } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Time } from "@/components/shared/time"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiClientError } from "@/lib/api/error"
import { can, useAuthStore } from "@/lib/auth"
import {
  useDeleteAsset,
  usePostAssets,
  useUploadAsset,
} from "@/lib/queries/posts"
import type { DownloadableAsset } from "@/types/api"

interface AssetsTabProps {
  postId: string
}

export function AssetsTab({ postId }: AssetsTabProps) {
  const user = useAuthStore((state) => state.user)
  const { data: assets, isPending, isError } = usePostAssets(postId)
  const uploadAsset = useUploadAsset(postId)
  const deleteAsset = useDeleteAsset(postId)
  const fileInput = useRef<HTMLInputElement>(null)

  const canDelete = can(user, "posts:publish")

  async function onUpload(file: File) {
    try {
      await uploadAsset.mutateAsync(file)
      toast.success("File attached.")
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Upload failed. Please try again."
      )
    }
  }

  async function copyUrl(asset: DownloadableAsset) {
    try {
      await navigator.clipboard.writeText(asset.file_url)
      toast.success("Link copied.")
    } catch {
      toast.error("Could not copy the link.")
    }
  }

  async function onDelete(asset: DownloadableAsset) {
    try {
      await deleteAsset.mutateAsync(asset.id)
      toast.success("File deleted.")
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Delete failed. Please try again."
      )
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInput}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onUpload(file)
          event.target.value = ""
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploadAsset.isPending}
        onClick={() => fileInput.current?.click()}
      >
        {uploadAsset.isPending ? "Uploading…" : "Attach file"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Excel or CSV workbooks readers can download.
      </p>

      {isPending ? (
        <div className="space-y-2">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">
          Could not load files. Refresh the page.
        </p>
      ) : (assets ?? []).length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          No files attached yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {(assets ?? []).map((asset) => (
            <li
              key={asset.id}
              className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {asset.file_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {asset.file_type.toUpperCase()}
                  {asset.file_size_kb
                    ? ` · ${Math.round(asset.file_size_kb)} KB`
                    : ""}
                  {" · "}
                  {asset.download_count} downloads ·{" "}
                  <Time date={asset.created_at} variant="relative" />
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyUrl(asset)}
                >
                  Copy link
                </Button>
                {canDelete ? (
                  <ConfirmDialog
                    trigger={
                      <Button type="button" variant="ghost" size="sm">
                        Delete
                      </Button>
                    }
                    title={`Delete "${asset.file_name}"?`}
                    description="Readers with the old link will no longer be able to download it."
                    confirmLabel="Delete"
                    onConfirm={() => onDelete(asset)}
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
