"use client"

import { useState } from "react"
import slugify from "slugify"
import { toast } from "sonner"

import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ApiClientError } from "@/lib/api/error"
import { can, useAuthStore } from "@/lib/auth"
import {
  useCreateTag,
  useTags,
} from "@/lib/queries/categories"

export function TagsView() {
  const user = useAuthStore((state) => state.user)
  const { data: tags, isPending, isError, refetch } = useTags()
  const createTag = useCreateTag()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [autoSlug, setAutoSlug] = useState(true)

  const canCreate = can(user, "tags:create") || can(user, "tags:manage")

  async function onCreate() {
    if (!name.trim()) {
      toast.error("Name is required.")
      return
    }
    try {
      await createTag.mutateAsync({
        name: name.trim(),
        slug: slug || undefined,
      })
      toast.success("Tag created.")
      setSheetOpen(false)
      setName("")
      setSlug("")
      setAutoSlug(true)
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not create the tag. Please try again."
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {(tags ?? []).length} tag{(tags ?? []).length === 1 ? "" : "s"} in
            use
          </p>
        </div>
        {canCreate ? (
          <Button type="button" size="sm" onClick={() => setSheetOpen(true)}>
            New tag
          </Button>
        ) : null}
      </div>

      {isError ? (
        <ErrorState
          title="Could not load tags"
          message="The tags service did not respond. Try again."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12" />
          ))}
        </div>
      ) : (tags ?? []).length === 0 ? (
        <EmptyState
          title="No tags yet"
          description="Tags are created here or directly from the post editor."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Slug</th>
                <th className="px-4 py-2.5 text-right font-medium">
                  Public page
                </th>
              </tr>
            </thead>
            <tbody>
              {(tags ?? []).map((tag) => (
                <tr key={tag.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2.5 font-medium">{tag.name}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                    {tag.slug}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <a
                      href={`/tags/${tag.slug}`}
                      className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>New tag</SheetTitle>
            <SheetDescription>
              Short labels readers can follow across posts.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Name</Label>
              <Input
                id="tag-name"
                value={name}
                maxLength={60}
                onChange={(event) => {
                  const next = event.target.value
                  setName(next)
                  if (autoSlug) {
                    setSlug(
                      slugify(next, { lower: true, strict: true, trim: true })
                    )
                  }
                }}
                placeholder="e.g. VLOOKUP"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tag-slug">Slug</Label>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={autoSlug}
                    onChange={(event) => setAutoSlug(event.target.checked)}
                  />
                  Auto from name
                </label>
              </div>
              <Input
                id="tag-slug"
                value={slug}
                disabled={autoSlug}
                onChange={(event) => setSlug(event.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onCreate}
                disabled={createTag.isPending}
              >
                {createTag.isPending ? "Creating…" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSheetOpen(false)}
                disabled={createTag.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
