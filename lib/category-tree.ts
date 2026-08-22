import type { Category } from "@/types/api"

export interface FlatCategoryRow {
  id: string
  name: string
  parentId: string | null
  depth: number
}

export interface ReorderEntry {
  id: string
  order_index: number
  parent_id: string | null
}

export function flattenCategories(
  categories: Category[],
  depth = 0,
  parentId: string | null = null
): FlatCategoryRow[] {
  return categories.flatMap((category) => [
    { id: category.id, name: category.name, parentId, depth },
    ...flattenCategories(category.children ?? [], depth + 1, category.id),
  ])
}

export function moveSubtree(
  rows: FlatCategoryRow[],
  dragId: string,
  dropIndex: number
): FlatCategoryRow[] {
  const dragIndex = rows.findIndex((row) => row.id === dragId)
  if (dragIndex === -1) return rows

  const dragDepth = rows[dragIndex].depth
  let lastIndex = dragIndex + 1
  while (lastIndex < rows.length && rows[lastIndex].depth > dragDepth) {
    lastIndex += 1
  }

  const before = rows.slice(0, dragIndex)
  const block = rows.slice(dragIndex, lastIndex)
  const after = rows.slice(lastIndex)

  const insertAt = Math.max(
    0,
    Math.min(dropIndex > dragIndex ? dropIndex - block.length + 1 : dropIndex, before.length + after.length)
  )

  const moved = [...before, ...after]
  moved.splice(insertAt, 0, ...block)
  return reassignParents(moved)
}

function reassignParents(rows: FlatCategoryRow[]): FlatCategoryRow[] {
  const result: FlatCategoryRow[] = []
  for (const row of rows) {
    let parentId: string | null = null
    let depth = row.depth
    for (let i = result.length - 1; i >= 0; i -= 1) {
      const above = result[i]
      if (above.depth < depth) {
        if (above.depth === depth - 1) parentId = above.id
        else depth = 0
        break
      }
    }
    if (depth > 0 && parentId === null) depth = 0
    result.push({ ...row, parentId, depth })
  }
  return result
}

export function buildReorderPayload(
  rows: FlatCategoryRow[]
): ReorderEntry[] {
  const counters = new Map<string, number>()
  return rows.map((row) => {
    const key = row.parentId ?? "__root__"
    const next = (counters.get(key) ?? 0) + 1
    counters.set(key, next)
    return {
      id: row.id,
      order_index: next - 1,
      parent_id: row.parentId,
    }
  })
}

export function rowsChanged(
  current: FlatCategoryRow[],
  original: FlatCategoryRow[]
): boolean {
  if (current.length !== original.length) return true
  return current.some((row, index) => {
    const before = original[index]
    return (
      !before ||
      before.id !== row.id ||
      before.parentId !== row.parentId
    )
  })
}
