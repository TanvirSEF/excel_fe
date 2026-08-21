import { Node, mergeAttributes } from "@tiptap/core"
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react"

function HtmlBlockView({ node, selected }: ReactNodeViewProps) {
  const html = (node.attrs.html as string) ?? ""

  return (
    <NodeViewWrapper
      className={`rounded-lg border p-1 [&_iframe]:aspect-video [&_iframe]:w-full ${selected ? "border-primary" : ""}`}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </NodeViewWrapper>
  )
}

export const HtmlBlock = Node.create({
  name: "htmlBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      html: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-raw-html") ?? element.innerHTML ?? "",
      },
    }
  },

  parseHTML() {
    return [{ tag: "div[data-html-block]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-html-block": "" }, HTMLAttributes),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(HtmlBlockView)
  },
})
