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
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"

function InterlinkView({
  editor,
  node,
  getPos,
  updateAttributes,
  deleteNode,
  selected,
}: ReactNodeViewProps) {
  const url = (node.attrs.url as string) ?? ""
  const title = (node.attrs.title as string) ?? ""
  const prefix = (node.attrs.prefix as string) ?? "Similar Reading"
  const imageUrl = (node.attrs.imageUrl as string) ?? ""

  const insertParagraphAbove = () => {
    if (typeof getPos !== "function") return
    const pos = getPos()
    if (typeof pos !== "number") return
    editor
      .chain()
      .insertContentAt(pos, { type: "paragraph" })
      .setTextSelection(pos + 1)
      .focus()
      .run()
  }

  const insertParagraphBelow = () => {
    if (typeof getPos !== "function") return
    const pos = getPos()
    if (typeof pos !== "number") return
    const afterPos = pos + node.nodeSize
    editor
      .chain()
      .insertContentAt(afterPos, { type: "paragraph" })
      .setTextSelection(afterPos + 1)
      .focus()
      .run()
  }

  return (
    <NodeViewWrapper
      className={cn(
        "group/interlink relative my-3 rounded-2xl border transition-all select-none",
        selected
          ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20"
          : "border-border/80 bg-card hover:border-primary/40"
      )}
    >
      {/* Top hover insert bar */}
      <div className="absolute -top-3 left-0 right-0 flex justify-center opacity-0 transition-opacity group-hover/interlink:opacity-100 z-10 pointer-events-none">
        <button
          type="button"
          onClick={insertParagraphAbove}
          title="Insert paragraph above (Shift+Enter)"
          className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-primary/30 bg-background px-2.5 py-0.5 text-[11px] font-medium text-primary shadow-md hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
        >
          <IconPlus className="h-3 w-3" />
          <span>Insert text above</span>
        </button>
      </div>

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
                placeholder="Similar Reading"
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs font-semibold"
              />
            </div>
            <div className="space-y-1 sm:col-span-3">
              <label className="text-[11px] font-medium text-muted-foreground">
                Article Title
              </label>
              <input
                value={title}
                onChange={(e) => updateAttributes({ title: e.target.value })}
                placeholder="Target article title..."
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Target URL
              </label>
              <input
                value={url}
                onChange={(e) => updateAttributes({ url: e.target.value })}
                placeholder="https://excelinsider.com/blog/..."
                className="h-8 w-full rounded-md border border-input bg-background px-2 font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Image URL (optional)
              </label>
              <input
                value={imageUrl}
                onChange={(e) => updateAttributes({ imageUrl: e.target.value })}
                placeholder="https://..."
                className="h-8 w-full rounded-md border border-input bg-background px-2 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3.5 p-3.5 sm:p-4 cursor-pointer">
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconBook className="h-5 w-5" />
            </div>
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
          <div className="flex items-center gap-2.5 shrink-0">
            {imageUrl ? (
              <div className="relative h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
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

      {/* Bottom hover insert bar */}
      <div className="absolute -bottom-3 left-0 right-0 flex justify-center opacity-0 transition-opacity group-hover/interlink:opacity-100 z-10 pointer-events-none">
        <button
          type="button"
          onClick={insertParagraphBelow}
          title="Insert paragraph below (Enter)"
          className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-primary/30 bg-background px-2.5 py-0.5 text-[11px] font-medium text-primary shadow-md hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
        >
          <IconPlus className="h-3 w-3" />
          <span>Insert text below</span>
        </button>
      </div>
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
