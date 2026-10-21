"use client"

import Image from "next/image"

import { Node, mergeAttributes } from "@tiptap/core"
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react"
import {
  IconArrowRight,
  IconBook,
  IconExternalLink,
  IconPhoto,
  IconTrash,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"

function InterlinkView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: ReactNodeViewProps) {
  const url = (node.attrs.url as string) ?? ""
  const title = (node.attrs.title as string) ?? ""
  const prefix = (node.attrs.prefix as string) ?? "Read More"
  const imageUrl = (node.attrs.imageUrl as string) ?? ""

  return (
    <NodeViewWrapper
      className={cn(
        "my-3 rounded-2xl border transition-all select-none",
        selected
          ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20"
          : "border-border/80 bg-card hover:border-primary/40"
      )}
    >
      {selected ? (
        <div className="space-y-3 p-4 select-text">
          <div className="flex items-center justify-between border-b pb-2 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-primary font-bold">
              <IconBook className="h-4 w-4" />
              Edit Interlink / Read More
            </span>
            <button
              type="button"
              onClick={deleteNode}
              className="flex items-center gap-1 rounded-md border border-destructive/30 px-2.5 py-1 text-xs text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
            >
              <IconTrash className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Prefix
              </label>
              <input
                value={prefix}
                onChange={(e) => updateAttributes({ prefix: e.target.value })}
                placeholder="Read More"
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1 sm:col-span-3">
              <label className="text-[11px] font-medium text-muted-foreground">
                Post Title
              </label>
              <input
                value={title}
                onChange={(e) => updateAttributes({ title: e.target.value })}
                placeholder="Target article title"
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Target URL / Slug
              </label>
              <input
                value={url}
                onChange={(e) => updateAttributes({ url: e.target.value })}
                placeholder="/post-slug or https://..."
                className="h-8 w-full rounded-md border border-input bg-background px-2 font-mono text-xs outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Featured Thumbnail URL (optional)
              </label>
              <div className="flex gap-2">
                <input
                  value={imageUrl}
                  onChange={(e) =>
                    updateAttributes({ imageUrl: e.target.value })
                  }
                  placeholder="https://... (image URL)"
                  className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary"
                />
                {imageUrl ? (
                  <button
                    type="button"
                    onClick={() => updateAttributes({ imageUrl: "" })}
                    className="h-8 rounded-md border px-2 text-xs text-muted-foreground hover:text-foreground"
                    title="Remove image"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3.5 p-3.5 sm:p-4 cursor-pointer">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {imageUrl ? (
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <IconBook className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary mr-2">
                {prefix}:
              </span>
              <span className="font-semibold text-foreground text-sm">
                {title || "Untitled Post (click to edit)"}
              </span>
              <p className="truncate text-[11px] font-mono text-muted-foreground mt-0.5">
                {url || "No link specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {imageUrl ? (
              <span
                className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md"
                title="Has featured image"
              >
                <IconPhoto className="h-3.5 w-3.5" />
                Thumb
              </span>
            ) : null}
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-7 w-7 items-center justify-center rounded-lg border text-muted-foreground hover:bg-muted"
                title="Preview link in new tab"
              >
                <IconExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}

export const InterlinkNode = Node.create({
  name: "interlink",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      url: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-url") ?? "",
        renderHTML: (attributes) => ({ "data-url": attributes.url }),
      },
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") ?? "",
        renderHTML: (attributes) => ({ "data-title": attributes.title }),
      },
      prefix: {
        default: "Read More",
        parseHTML: (element) =>
          element.getAttribute("data-prefix") ?? "Read More",
        renderHTML: (attributes) => ({ "data-prefix": attributes.prefix }),
      },
      imageUrl: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-image-url") ?? "",
        renderHTML: (attributes) =>
          attributes.imageUrl ? { "data-image-url": attributes.imageUrl } : {},
      },
    }
  },

  parseHTML() {
    return [{ tag: "div[data-interlink]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-interlink": "" }, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InterlinkView)
  },
})
