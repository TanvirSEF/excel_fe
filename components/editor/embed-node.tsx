"use client"

import { Node, mergeAttributes } from "@tiptap/core"
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react"
import { IconPlayerPlay, IconTrash } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { toEmbedUrl } from "@/lib/embed"

function EmbedView({ node, updateAttributes, deleteNode, selected }: ReactNodeViewProps) {
  const url = (node.attrs.url as string) ?? ""
  const caption = (node.attrs.caption as string) ?? ""
  const embed = url ? toEmbedUrl(url) : null

  return (
    <NodeViewWrapper
      className={cn(
        "rounded-xl border border-dashed p-3 transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border"
      )}
    >
      {embed ? (
        <div className="space-y-2">
          <div className="[&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-lg [&_iframe]:border">
            <iframe
              src={embed}
              title={caption || "Embedded video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <input
            value={caption}
            onChange={(event) => updateAttributes({ caption: event.target.value })}
            placeholder="Caption (optional)"
            className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs outline-none"
          />
          <div className="flex items-center justify-between">
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              {url}
            </span>
            <button
              type="button"
              onClick={deleteNode}
              className="flex h-7 items-center gap-1 rounded-md border border-destructive/30 px-2 text-xs text-destructive transition-colors hover:bg-destructive/10"
            >
              <IconTrash className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <IconPlayerPlay className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={url}
            onChange={(event) => updateAttributes({ url: event.target.value })}
            placeholder="Paste a YouTube or Vimeo link…"
            className="h-8 flex-1 rounded-md border border-input bg-background px-2 font-mono text-xs outline-none"
          />
        </div>
      )}
    </NodeViewWrapper>
  )
}

export const EmbedNode = Node.create({
  name: "embed",
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
      caption: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-caption") ?? "",
        renderHTML: (attributes) => ({ "data-caption": attributes.caption }),
      },
    }
  },

  parseHTML() {
    return [{ tag: "div[data-embed]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-embed": "" }, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedView)
  },
})
