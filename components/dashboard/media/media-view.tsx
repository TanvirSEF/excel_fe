"use client"

import { useState } from "react"

import {
  MediaDropzone,
} from "@/components/dashboard/media/media-dropzone"
import {
  MediaDrawer,
} from "@/components/dashboard/media/media-drawer"
import {
  MediaGrid,
} from "@/components/dashboard/media/media-grid"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { can, useAuthStore } from "@/lib/auth"
import { useMediaFolders, useMediaList } from "@/lib/queries/media"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/types/api"

const PAGE_SIZE = 20

export function MediaView() {
  const user = useAuthStore((state) => state.user)
  const [folder, setFolder] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<MediaItem | null>(null)

  const { data, isPending, isError, refetch } = useMediaList({
    folder: folder ?? undefined,
    page,
    page_size: PAGE_SIZE,
  })
  const { data: folders } = useMediaFolders()

  const canUpload =
    can(user, "media:manage") || can(user, "media:upload")

  const total = data?.total ?? 0
  const totalPages = data?.total_pages ?? 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} file{total === 1 ? "" : "s"} in the library
          </p>
        </div>
      </div>

      {canUpload ? <MediaDropzone defaultFolder={folder ?? ""} /> : null}

      <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
        <nav className="space-y-1" aria-label="Media folders">
          <FolderLink
            active={folder === null}
            onClick={() => {
              setFolder(null)
              setPage(1)
            }}
            label="All files"
          />
          {folders === undefined ? (
            <Skeleton className="h-8" />
          ) : (
            folders.map((name) => (
              <FolderLink
                key={name}
                active={folder === name}
                onClick={() => {
                  setFolder(name)
                  setPage(1)
                }}
                label={name}
              />
            ))
          )}
        </nav>

        <div className="space-y-4">
          {isError ? (
            <ErrorState
              title="Could not load media"
              message="The media service did not respond. Try again."
              action={
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Try again
                </Button>
              }
            />
          ) : (
            <>
              <MediaGrid
                items={data?.items}
                isPending={isPending}
                onSelect={setSelected}
              />
              {totalPages > 1 ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((current) => current - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((current) => current + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <MediaDrawer
        item={selected}
        onClose={() => setSelected(null)}
        onDeleted={() => refetch()}
      />
    </div>
  )
}

function FolderLink({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full truncate rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
        active
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}
