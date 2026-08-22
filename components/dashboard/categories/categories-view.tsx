"use client"

import { useState } from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { toast } from "sonner"

import { CategoryRow } from "@/components/dashboard/categories/category-row"
import { CategorySheet } from "@/components/dashboard/categories/category-sheet"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiClientError } from "@/lib/api/error"
import { can, useAuthStore } from "@/lib/auth"
import {
  buildReorderPayload,
  flattenCategories,
  moveSubtree,
  rowsChanged,
  type FlatCategoryRow,
} from "@/lib/category-tree"
import {
  useCategories,
  useDeleteCategory,
  useReorderCategories,
} from "@/lib/queries/categories"
import type { Category } from "@/types/api"

export function CategoriesView() {
  const user = useAuthStore((state) => state.user)
  const { data: categories, isPending, isError, refetch } = useCategories()
  const reorderCategories = useReorderCategories()
  const deleteCategory = useDeleteCategory()

  const [rows, setRows] = useState<FlatCategoryRow[] | null>(null)
  const [loadedSignature, setLoadedSignature] = useState<string>("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  const canDelete = can(user, "categories:delete")

  const signature = (categories ?? [])
    .flatMap((parent) => [
      parent.id,
      ...parent.children.map((child) => child.id),
    ])
    .join(",")

  if (categories && signature !== loadedSignature) {
    setLoadedSignature(signature)
    setRows(flattenCategories(categories))
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor)
  )

  const original = categories ? flattenCategories(categories) : []
  const dirty = rows !== null && rowsChanged(rows, original)

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id || rows === null) return
    const overIndex = rows.findIndex((row) => row.id === over.id)
    if (overIndex === -1) return
    setRows(moveSubtree(rows, String(active.id), overIndex))
  }

  async function onSaveOrder() {
    if (!rows) return
    try {
      await reorderCategories.mutateAsync(buildReorderPayload(rows))
      toast.success("Order saved.")
      setRows(null)
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not save the order. Please try again."
      )
    }
  }

  async function onDelete() {
    if (!deleting) return
    try {
      await deleteCategory.mutateAsync(deleting.id)
      toast.success("Category deleted.")
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not delete. Please try again."
      )
    } finally {
      setDeleting(null)
    }
  }

  const rowMeta = new Map(
    (categories ?? []).flatMap((parent) => [
      [parent.id, parent] as const,
      ...parent.children.map((child) => [child.id, child] as const),
    ])
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to reorder — a row dropped under another top-level row
            becomes its child.
          </p>
        </div>
        <div className="flex gap-2">
          {dirty ? (
            <Button
              type="button"
              size="sm"
              onClick={onSaveOrder}
              disabled={reorderCategories.isPending}
            >
              {reorderCategories.isPending ? "Saving…" : "Save order"}
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setEditing(null)
              setSheetOpen(true)
            }}
          >
            New category
          </Button>
        </div>
      </div>

      {isError ? (
        <ErrorState
          title="Could not load categories"
          message="The categories service did not respond. Try again."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-11" />
          ))}
        </div>
      ) : (categories ?? []).length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create the first category to organise your posts."
          action={
            <Button size="sm" onClick={() => setSheetOpen(true)}>
              New category
            </Button>
          }
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={(rows ?? original).map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {(rows ?? original).map((row) => {
                const meta = rowMeta.get(row.id)
                return (
                  <CategoryRow
                    key={row.id}
                    row={row}
                    colorHex={meta?.color_hex}
                    isFeatured={meta?.is_featured}
                    canDelete={canDelete}
                    onEdit={() => {
                      setEditing(meta ?? null)
                      setSheetOpen(true)
                    }}
                    onDelete={() => setDeleting(meta ?? null)}
                  />
                )
              })}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {dirty ? (
        <p className="text-xs text-muted-foreground">
          Unsaved order — press “Save order” to persist your changes.
        </p>
      ) : null}

      <CategorySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        category={editing}
        categories={categories ?? []}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete "${deleting?.name ?? ""}"?`}
        description="Categories with posts cannot be deleted — move the posts first."
        confirmLabel="Delete"
        onConfirm={onDelete}
      />
    </div>
  )
}
