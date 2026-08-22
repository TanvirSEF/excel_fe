"use client"

import { IconGripVertical } from "@tabler/icons-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { FlatCategoryRow } from "@/lib/category-tree"

interface CategoryRowProps {
  row: FlatCategoryRow
  colorHex?: string | null
  isFeatured?: boolean
  canDelete: boolean
  onEdit: () => void
  onDelete: () => void
}

export function CategoryRow({
  row,
  colorHex,
  isFeatured,
  canDelete,
  onEdit,
  onDelete,
}: CategoryRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-card px-3 py-2",
        isDragging && "opacity-50"
      )}
    >
      <span style={{ width: row.depth * 24 }} aria-hidden />
      {row.depth > 0 ? (
        <span className="text-muted-foreground" aria-hidden>
          ↳
        </span>
      ) : null}
      <button
        type="button"
        aria-label={`Drag ${row.name}`}
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
      >
        <IconGripVertical size={16} stroke={1.5} />
      </button>
      <span
        className="size-2.5 shrink-0 rounded-full border"
        style={{ backgroundColor: colorHex ?? "transparent" }}
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {row.name}
        {isFeatured ? (
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-normal text-primary">
            Featured
          </span>
        ) : null}
      </span>
      <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
        Edit
      </Button>
      {canDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          Delete
        </Button>
      ) : null}
    </li>
  )
}
