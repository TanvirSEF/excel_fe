"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { ApiClientError } from "@/lib/api/error"
import { useUploadMedia } from "@/lib/queries/media"
import { cn } from "@/lib/utils"

interface MediaDropzoneProps {
  defaultFolder?: string
}

export function MediaDropzone({ defaultFolder = "" }: MediaDropzoneProps) {
  const uploadMedia = useUploadMedia()
  const fileInput = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [folder, setFolder] = useState(defaultFolder)

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files)
    if (list.length === 0) return
    let uploaded = 0
    for (const file of list) {
      try {
        await uploadMedia.mutateAsync({
          file,
          folder: folder.trim() || undefined,
        })
        uploaded += 1
      } catch (error) {
        toast.error(
          error instanceof ApiClientError
            ? `${file.name}: ${error.message}`
            : `${file.name}: upload failed.`
        )
      }
    }
    if (uploaded > 0) {
      toast.success(
        uploaded === 1
          ? "1 file uploaded."
          : `${uploaded} of ${list.length} files uploaded.`
      )
    }
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onClick={() => fileInput.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            fileInput.current?.click()
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          uploadFiles(event.dataTransfer.files)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "hover:border-primary/50 hover:bg-accent/40"
        )}
      >
        <p className="text-sm font-medium">Drop files here or click to upload</p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, WebP or GIF — stored in R2
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={folder}
          onChange={(event) => setFolder(event.target.value)}
          placeholder="Folder for new uploads (optional)"
          className="h-8 text-xs"
        />
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) uploadFiles(event.target.files)
          event.target.value = ""
        }}
      />
      {uploadMedia.isPending ? (
        <p className="text-xs text-muted-foreground">Uploading…</p>
      ) : null}
    </div>
  )
}
