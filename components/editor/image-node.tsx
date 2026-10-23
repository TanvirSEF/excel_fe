"use client"

import Image from "@tiptap/extension-image"
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react"
import { IconPlus, IconTrash } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

function ImageView({
  editor,
  node,
  getPos,
  deleteNode,
  selected,
}: ReactNodeViewProps) {
  const src = (node.attrs.src as string) ?? ""
  const alt = (node.attrs.alt as string) ?? ""
  const width = node.attrs.width ? Number(node.attrs.width) : undefined
  const height = node.attrs.height ? Number(node.attrs.height) : undefined

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
        "group/image relative my-4 block transition-all",
        selected && "ring-2 ring-primary ring-offset-2 rounded-xl"
      )}
    >
      {/* Top hover insert bar */}
      <div className="absolute -top-3 left-0 right-0 flex justify-center opacity-0 transition-opacity group-hover/image:opacity-100 z-10 pointer-events-none">
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

      {/* Image display */}
      <div className="relative inline-block max-w-full overflow-hidden rounded-xl border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="max-h-[600px] w-auto max-w-full rounded-xl object-contain"
          loading="lazy"
        />

        {/* Delete button when selected or hovered */}
        <button
          type="button"
          onClick={deleteNode}
          title="Delete image"
          className="absolute right-2 top-2 hidden items-center justify-center rounded-md bg-destructive/90 p-1.5 text-white shadow-xs transition-colors hover:bg-destructive group-hover/image:flex cursor-pointer"
        >
          <IconTrash className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Bottom hover insert bar */}
      <div className="absolute -bottom-3 left-0 right-0 flex justify-center opacity-0 transition-opacity group-hover/image:opacity-100 z-10 pointer-events-none">
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

export const SizedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null },
      height: { default: null },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView)
  },
})
