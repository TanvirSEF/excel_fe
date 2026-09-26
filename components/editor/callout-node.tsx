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
  IconSparkles,
  IconMathFunction,
  IconNotes,
  IconPaperclip,
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

  const isTakeaway =
    Boolean(title && /takeaway/i.test(title)) ||
    (variant === "tip" && title.toLowerCase() === "key takeaways")

  const isNote =
    !isTakeaway &&
    (Boolean(title && /^notes?\b/i.test(title.trim())) ||
      (variant === "info" && title.toLowerCase() === "note"))

  const isExplanation =
    !isTakeaway &&
    !isNote &&
    Boolean(title && /(explanation|explain)/i.test(title))

  const isFormula =
    !isTakeaway &&
    !isNote &&
    !isExplanation &&
    Boolean(title && /formula/i.test(title))

  const presetButtons = (
    <div className="ml-auto flex items-center gap-1">
      {/* Quick Design Switchers */}
      <div className="hidden sm:flex items-center gap-0.5 rounded-md border bg-background/80 px-1 py-0.5 text-[11px] font-medium text-muted-foreground">
        <button
          type="button"
          title="Switch to Key Takeaways ribbon banner"
          onClick={() => updateAttributes({ variant: "tip", title: "Key Takeaways" })}
          className={cn(
            "rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground",
            isTakeaway && "bg-emerald-500/15 font-bold text-emerald-600 dark:text-emerald-400"
          )}
        >
          Takeaways
        </button>
        <button
          type="button"
          title="Switch to Formula Box"
          onClick={() => updateAttributes({ variant: "info", title: "Formula" })}
          className={cn(
            "rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground",
            isFormula && "bg-primary/15 font-bold text-primary"
          )}
        >
          Formula
        </button>
        <button
          type="button"
          title="Switch to Formula Explanation card"
          onClick={() => updateAttributes({ variant: "info", title: "Formula Explanation" })}
          className={cn(
            "rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground",
            isExplanation && title.toLowerCase().includes("formula") && "bg-primary/15 font-bold text-primary"
          )}
        >
          Formula Explain
        </button>
        <button
          type="button"
          title="Switch to Explanation card"
          onClick={() => updateAttributes({ variant: "info", title: "Explanation" })}
          className={cn(
            "rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground",
            isExplanation && !title.toLowerCase().includes("formula") && "bg-primary/15 font-bold text-primary"
          )}
        >
          Explain
        </button>
        <button
          type="button"
          title="Switch to Note callout"
          onClick={() => updateAttributes({ variant: "info", title: "Note" })}
          className={cn(
            "rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground",
            isNote && "bg-primary/15 font-bold text-primary"
          )}
        >
          Note
        </button>
      </div>

      {/* Variant icons */}
      <span className="flex items-center gap-0.5 rounded-md border bg-background/80 p-0.5">
        {(Object.keys(CALLOUT_VARIANTS) as CalloutVariant[]).map((key) => {
          const Item = CALLOUT_VARIANTS[key].icon
          return (
            <button
              key={key}
              type="button"
              title={CALLOUT_VARIANTS[key].label}
              onClick={() => updateAttributes({ variant: key })}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                variant === key && CALLOUT_VARIANTS[key].iconClass
              )}
            >
              <Item className="h-3.5 w-3.5" />
            </button>
          )
        })}
      </span>
    </div>
  )

  if (isTakeaway) {
    return (
      <NodeViewWrapper
        className={cn(
          "relative my-4 rounded-2xl border-2 border-primary/35 bg-gradient-to-b from-primary/[0.06] via-primary/[0.02] to-transparent p-4 sm:p-5 pt-6 shadow-xs transition-colors",
          selected && "ring-2 ring-primary/40"
        )}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-chart-5 via-primary to-chart-5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
              <IconSparkles className="h-3.5 w-3.5 text-amber-300 shrink-0" />
              <span>Key Takeaways</span>
            </span>
            <input
              value={title}
              onChange={(event) => updateAttributes({ title: event.target.value })}
              placeholder="Key Takeaways"
              className="w-36 border-none bg-transparent p-0 text-xs font-medium text-muted-foreground outline-none"
            />
          </div>
          {presetButtons}
        </div>
        <NodeViewContent className="callout-content text-sm leading-6" />
      </NodeViewWrapper>
    )
  }

  if (isFormula) {
    return (
      <NodeViewWrapper
        className={cn(
          "relative my-4 rounded-[4px] border border-border/80 bg-card p-4 shadow-[1.5px_1.5px_2px_rgba(0,0,0,0.35)] dark:shadow-[1.5px_1.5px_2px_rgba(0,0,0,0.7)] transition-colors",
          selected && "ring-2 ring-primary/40"
        )}
      >
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary font-mono">
              <IconMathFunction className="h-3.5 w-3.5" />
              Formula Box
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              (Live post renders centered serif card with 1-click copy)
            </span>
          </div>
          {presetButtons}
        </div>
        <NodeViewContent className="callout-content text-sm sm:text-[0.9375rem] font-serif font-normal text-center leading-6 text-foreground selection:bg-primary/20 break-words [overflow-wrap:anywhere]" />
      </NodeViewWrapper>
    )
  }

  if (isExplanation) {
    return (
      <NodeViewWrapper
        className={cn(
          "relative my-4 rounded-2xl border-2 border-primary/50 bg-gradient-to-b from-primary/[0.04] to-transparent p-4 sm:p-5 pt-5 shadow-xs transition-colors",
          selected && "ring-2 ring-primary/40"
        )}
      >
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
          <div className="flex items-center gap-1.5">
            <IconNotes className="h-4 w-4 text-primary shrink-0" />
            <input
              value={title}
              onChange={(event) => updateAttributes({ title: event.target.value })}
              placeholder="Explanation"
              className="w-48 border-none bg-transparent p-0 text-sm font-bold text-primary outline-none"
            />
          </div>
          {presetButtons}
        </div>
        <NodeViewContent className="callout-content text-sm leading-6" />
      </NodeViewWrapper>
    )
  }

  if (isNote) {
    return (
      <NodeViewWrapper
        className={cn(
          "relative my-4 rounded-r-2xl border-l-[5px] border-primary bg-primary/[0.08] p-4 shadow-xs transition-colors dark:bg-primary/[0.14]",
          selected && "ring-2 ring-primary/40"
        )}
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 pb-2">
          <div className="flex items-center gap-1.5">
            <IconPaperclip className="h-4 w-4 text-primary shrink-0" />
            <input
              value={title}
              onChange={(event) => updateAttributes({ title: event.target.value })}
              placeholder="Note:"
              className="w-36 border-none bg-transparent p-0 text-sm font-bold text-primary outline-none"
            />
          </div>
          {presetButtons}
        </div>
        <NodeViewContent className="callout-content text-sm leading-6" />
      </NodeViewWrapper>
    )
  }

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
        {presetButtons}
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
