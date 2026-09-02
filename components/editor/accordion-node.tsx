"use client"

import { Node, mergeAttributes } from "@tiptap/core"
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react"
import { IconChevronDown } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

function AccordionView({ node, updateAttributes, selected }: ReactNodeViewProps) {
  const title = (node.attrs.title as string) ?? ""

  return (
    <NodeViewWrapper
      className={cn(
        "rounded-xl border transition-colors",
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
      </div>
      <NodeViewContent className="accordion-content px-3 py-2 text-sm leading-6" />
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
