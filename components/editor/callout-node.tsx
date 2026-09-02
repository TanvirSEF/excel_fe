"use client"

import { Node, mergeAttributes } from "@tiptap/core"
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react"
import {
  IconAlertTriangle,
  IconBulb,
  IconInfoCircle,
  IconAlertOctagon,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import type { CalloutVariant } from "@/types/api"

export const CALLOUT_VARIANTS: Record<
  CalloutVariant,
  { label: string; icon: typeof IconInfoCircle; box: string; iconClass: string }
> = {
  info: {
    label: "Info",
    icon: IconInfoCircle,
    box: "border-sky-500/30 bg-sky-500/5",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  tip: {
    label: "Tip",
    icon: IconBulb,
    box: "border-emerald-500/30 bg-emerald-500/5",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    label: "Warning",
    icon: IconAlertTriangle,
    box: "border-amber-500/30 bg-amber-500/5",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    label: "Danger",
    icon: IconAlertOctagon,
    box: "border-red-500/30 bg-red-500/5",
    iconClass: "text-red-600 dark:text-red-400",
  },
}

function CalloutView({ node, updateAttributes, selected }: ReactNodeViewProps) {
  const variant = (node.attrs.variant as CalloutVariant) ?? "info"
  const title = (node.attrs.title as string) ?? ""
  const meta = CALLOUT_VARIANTS[variant] ?? CALLOUT_VARIANTS.info
  const Icon = meta.icon

  return (
    <NodeViewWrapper
      className={cn(
        "rounded-xl border p-4 transition-colors",
        meta.box,
        selected && "ring-2 ring-primary/40"
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <Icon className={cn("h-4 w-4", meta.iconClass)} />
          <input
            value={title}
            onChange={(event) => updateAttributes({ title: event.target.value })}
            placeholder={`${meta.label} title…`}
            className="w-44 border-none bg-transparent p-0 text-sm font-semibold outline-none placeholder:text-muted-foreground/60"
          />
        </span>
        <span className="ml-auto flex items-center gap-1 rounded-lg border bg-background/80 p-0.5">
          {(Object.keys(CALLOUT_VARIANTS) as CalloutVariant[]).map((key) => {
            const Item = CALLOUT_VARIANTS[key].icon
            return (
              <button
                key={key}
                type="button"
                title={CALLOUT_VARIANTS[key].label}
                onClick={() => updateAttributes({ variant: key })}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  variant === key && CALLOUT_VARIANTS[key].iconClass
                )}
              >
                <Item className="h-3.5 w-3.5" />
              </button>
            )
          })}
        </span>
      </div>
      <NodeViewContent className="callout-content text-sm leading-6" />
    </NodeViewWrapper>
  )
}

export const CalloutNode = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: "info",
        parseHTML: (element) => element.getAttribute("data-variant") ?? "info",
        renderHTML: (attributes) => ({ "data-variant": attributes.variant }),
      },
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") ?? "",
        renderHTML: (attributes) => ({ "data-title": attributes.title }),
      },
    }
  },

  parseHTML() {
    return [{ tag: "div[data-callout]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-callout": "" }, HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutView)
  },
})
