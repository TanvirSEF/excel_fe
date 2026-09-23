"use client"

import Link from "next/link"
import { useMemo } from "react"
import {
  FlexRender,
  columnVisibilityFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"

import { PostStatusBadge } from "@/components/dashboard/post-status-badge"
import { Time } from "@/components/shared/time"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PostAdminItem } from "@/types/api"

const features = tableFeatures({ columnVisibilityFeature })

const columnHelper = createColumnHelper<typeof features, PostAdminItem>()

interface PostsTableProps {
  posts: PostAdminItem[]
  canDelete: boolean
  onDelete: (post: PostAdminItem) => void
  canPin: boolean
  onTogglePin: (post: PostAdminItem, pinned: boolean) => void
}

export function PostsTable({ posts, canDelete, onDelete, canPin, onTogglePin }: PostsTableProps) {
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("title", {
          header: "Title",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/posts/${row.original.id}`}
                className="font-medium hover:text-primary"
              >
                <span className="line-clamp-1">{row.original.title}</span>
              </Link>
              {row.original.is_trending_pinned ? (
                <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                  Pinned
                </span>
              ) : row.original.is_trending ? (
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  Trending
                </span>
              ) : null}
            </div>
          ),
        }),
        columnHelper.accessor("status", {
          header: "Status",
          cell: ({ row }) => (
            <PostStatusBadge
              status={row.original.status}
              rejectionReason={row.original.rejection_reason}
            />
          ),
        }),
        columnHelper.accessor("author_name", {
          header: "Author",
        }),
        columnHelper.accessor("category_name", {
          header: "Category",
          cell: ({ row }) => row.original.category_name ?? "—",
        }),
        columnHelper.accessor("updated_at", {
          header: "Updated",
          cell: ({ row }) => (
            <Time date={row.original.updated_at} variant="relative" />
          ),
        }),
        columnHelper.accessor("published_at", {
          header: "Published",
          cell: ({ row }) =>
            row.original.published_at ? (
              <Time date={row.original.published_at} variant="date" />
            ) : (
              "—"
            ),
        }),
        columnHelper.display({
          id: "actions",
          header: () => null,
          cell: ({ row }) => (
            <div className="flex items-center justify-end gap-2.5">
              <Link
                href={`/dashboard/posts/${row.original.id}`}
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Edit
              </Link>
              {canPin && row.original.status === "published" ? (
                <button
                  type="button"
                  onClick={() =>
                    onTogglePin(row.original, !row.original.is_trending_pinned)
                  }
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {row.original.is_trending_pinned ? "Unpin" : "Pin"}
                </button>
              ) : null}
              {row.original.status === "published" ? (
                <Link
                  href={`/blog/${row.original.slug}`}
                  target="_blank"
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  View public
                </Link>
              ) : null}
              <Link
                href={`/dashboard/analytics?post=${row.original.id}`}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Stats
              </Link>
              {canDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(row.original)}
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
                >
                  Delete
                </button>
              ) : null}
            </div>
          ),
        }),
      ]),
    [canDelete, onDelete, canPin, onTogglePin]
  )

  const table = useTable({
    features,
    data: posts,
    columns,
    getRowId: (row) => row.id,
  })

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <FlexRender header={header} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  <FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
