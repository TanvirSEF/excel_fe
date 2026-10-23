"use client"

import { Node, mergeAttributes } from "@tiptap/core"
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react"
import { IconChevronDown, IconCornerDownLeft, IconPlus } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

function AccordionView({
  editor,
  node,
  getPos,
  updateAttributes,
  selected,
}: ReactNodeViewProps) {
  const title = (node.attrs.title as string) ?? ""

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
        "group/accordion relative rounded-xl border transition-colors",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border"
      )}
    >
      <div className="flex items-center gap-2 border-b bg-muted/30 px-3 py-2">
        <IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={title}
          onChange={(event) => updateAttributes({ title: event.target.value })}
          placeholder="Section title (click to expand)…"
          className="flex-1 border-none bg-transparent p-0 text-sm font-medium outline-none placeholder:text-muted-foreground/60"
        />
        <button
          type="button"
          title="Insert paragraph below (Ctrl+Enter)"
          onClick={insertParagraphBelow}
          className="flex h-6 items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 text-[11px] font-semibold text-primary shadow-xs transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
        >
          <IconCornerDownLeft className="h-3 w-3" />
          <span>Text Below</span>
        </button>
      </div>
      <NodeViewContent className="accordion-content px-3 py-2 text-sm leading-6" />

      {/* Bottom hover insert bar */}
      <div className="absolute -bottom-3 left-0 right-0 flex justify-center opacity-0 transition-opacity group-hover/accordion:opacity-100 z-10 pointer-events-none">
        <button
          type="button"
          onClick={insertParagraphBelow}
          title="Insert paragraph below (Ctrl+Enter)"
          className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-primary/30 bg-background px-2.5 py-0.5 text-[11px] font-medium text-primary shadow-md hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
        >
          <IconPlus className="h-3 w-3" />
          <span>Insert text here</span>
        </button>
      </div>
    </NodeViewWrapper>
  )
}

export const AccordionNode = Node.create({
  name: "accordion",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") ?? "",
        renderHTML: (attributes) => ({ "data-title": attributes.title }),
      },
    }
  },

  parseHTML() {
    return [{ tag: "div[data-accordion]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-accordion": "" }, HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AccordionView)
  },
})
