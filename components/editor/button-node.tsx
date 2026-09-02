"use client"

import { Node, mergeAttributes } from "@tiptap/core"
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react"
import { IconTrash } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import type { ButtonVariant } from "@/types/api"

function ButtonView({ node, updateAttributes, deleteNode, selected }: ReactNodeViewProps) {
  const label = (node.attrs.label as string) ?? ""
  const href = (node.attrs.href as string) ?? ""
  const variant = (node.attrs.variant as ButtonVariant) ?? "primary"

  return (
    <NodeViewWrapper
      className={cn(
        "my-1 rounded-xl border border-dashed p-3 transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border"
      )}
    >
      {selected ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <input
              value={label}
              onChange={(event) => updateAttributes({ label: event.target.value })}
              placeholder="Button label"
              className="h-8 flex-1 min-w-40 rounded-md border border-input bg-background px-2 text-xs outline-none"
            />
            <input
              value={href}
              onChange={(event) => updateAttributes({ href: event.target.value })}
              placeholder="https://link"
              className="h-8 flex-1 min-w-40 rounded-md border border-input bg-background px-2 font-mono text-xs outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={variant}
              onChange={(event) =>
                updateAttributes({ variant: event.target.value as ButtonVariant })
              }
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="primary">Primary (solid)</option>
              <option value="outline">Outline</option>
            </select>
            <button
              type="button"
              onClick={deleteNode}
              className="ml-auto flex h-8 items-center gap-1 rounded-md border border-destructive/30 px-2.5 text-xs text-destructive transition-colors hover:bg-destructive/10"
            >
              <IconTrash className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <span
          className={cn(
            "inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold",
            variant === "primary"
              ? "bg-primary text-primary-foreground"
              : "border border-primary/40 text-primary"
          )}
        >
          {label || "CTA Button — click to edit"}
        </span>
      )}
    </NodeViewWrapper>
  )
}

export const CtaButtonNode = Node.create({
  name: "ctaButton",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      label: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-label") ?? "",
        renderHTML: (attributes) => ({ "data-label": attributes.label }),
      },
      href: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-href") ?? "",
        renderHTML: (attributes) => ({ "data-href": attributes.href }),
      },
      variant: {
        default: "primary",
        parseHTML: (element) => element.getAttribute("data-variant") ?? "primary",
        renderHTML: (attributes) => ({ "data-variant": attributes.variant }),
      },
    }
  },

  parseHTML() {
    return [{ tag: "div[data-cta-button]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-cta-button": "" }, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonView)
  },
})
