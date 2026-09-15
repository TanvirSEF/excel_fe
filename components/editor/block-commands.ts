import type { ComponentType } from "react"
import type { Editor } from "@tiptap/react"
import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconBrandHtml5,
  IconBulb,
  IconCaretRight,
  IconChevronsDown,
  IconCode,
  IconInfoCircle,
  IconKeyboard,
  IconLink,
  IconList,
  IconListNumbers,
  IconMinus,
  IconPhoto,
  IconQuote,
  IconSparkles,
  IconTable,
  IconVideo,
} from "@tabler/icons-react"

import type { CalloutVariant } from "@/types/api"

export type BlockGroupId = "callouts" | "structure" | "media" | "advanced"
export type BlockPanel = "image" | "button" | "embed" | "html" | "keys"

export interface BlockCommand {
  id: string
  label: string
  description: string
  icon: ComponentType<{ className?: string }>
  keywords: string[]
  group: BlockGroupId
  panel?: BlockPanel
  action?: (editor: Editor) => void
}

export const BLOCK_GROUPS: { id: BlockGroupId; label: string }[] = [
  { id: "callouts", label: "Callouts" },
  { id: "structure", label: "Layout & structure" },
  { id: "media", label: "Media" },
  { id: "advanced", label: "Advanced" },
]

export function insertCallout(
  editor: Editor,
  variant: CalloutVariant,
  title = ""
) {
  editor
    .chain()
    .focus()
    .insertContent({
      type: "callout",
      attrs: { variant, title },
      content: [{ type: "paragraph" }],
    })
    .run()
}

export function nextHeadingNumber(editor: Editor): string {
  let count = 0
  editor.state.doc.descendants((node) => {
    if (node.type.name === "heading" && node.attrs.num) count += 1
  })
  return String(count + 1)
}

export function runBlockCommand(
  editor: Editor,
  item: BlockCommand,
  openPanel: (panel: BlockPanel) => void
) {
  if (item.panel) {
    openPanel(item.panel)
    return
  }
  item.action?.(editor)
}

export const BLOCK_COMMANDS: BlockCommand[] = [
  {
    id: "key-takeaways",
    label: "Key Takeaways",
    description: "Green summary banner",
    icon: IconSparkles,
    keywords: ["takeaways", "summary", "highlight", "callout", "tip"],
    group: "callouts",
    action: (editor) => insertCallout(editor, "tip", "Key Takeaways"),
  },
  {
    id: "callout-info",
    label: "Callout — Info",
    description: "Blue note box",
    icon: IconInfoCircle,
    keywords: ["info", "note", "callout"],
    group: "callouts",
    action: (editor) => insertCallout(editor, "info"),
  },
  {
    id: "callout-tip",
    label: "Callout — Tip",
    description: "Tip box",
    icon: IconBulb,
    keywords: ["tip", "hint", "advice", "callout"],
    group: "callouts",
    action: (editor) => insertCallout(editor, "tip"),
  },
  {
    id: "callout-warning",
    label: "Callout — Warning",
    description: "Amber warning box",
    icon: IconAlertTriangle,
    keywords: ["warning", "caution", "callout"],
    group: "callouts",
    action: (editor) => insertCallout(editor, "warning"),
  },
  {
    id: "callout-danger",
    label: "Callout — Danger",
    description: "Red danger box",
    icon: IconAlertOctagon,
    keywords: ["danger", "error", "critical", "callout"],
    group: "callouts",
    action: (editor) => insertCallout(editor, "danger"),
  },
  {
    id: "table",
    label: "Table",
    description: "3×3 table with header row",
    icon: IconTable,
    keywords: ["table", "grid", "rows", "columns"],
    group: "structure",
    action: (editor) =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    id: "accordion",
    label: "Accordion",
    description: "Collapsible section",
    icon: IconChevronsDown,
    keywords: ["accordion", "collapse", "expand", "details", "faq"],
    group: "structure",
    action: (editor) =>
      editor
        .chain()
        .focus()
        .insertContent({
          type: "accordion",
          attrs: { title: "" },
          content: [{ type: "paragraph" }],
        })
        .run(),
  },
  {
    id: "numbered-heading",
    label: "Numbered heading",
    description: "Heading with section number",
    icon: IconListNumbers,
    keywords: ["heading", "numbered", "section", "h2", "num", "numhead"],
    group: "structure",
    action: (editor) =>
      editor
        .chain()
        .focus()
        .setHeading({ level: 2 })
        .updateAttributes("heading", { num: nextHeadingNumber(editor) })
        .run(),
  },
  {
    id: "quote",
    label: "Quote",
    description: "Blockquote",
    icon: IconQuote,
    keywords: ["quote", "blockquote", "citation"],
    group: "structure",
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    id: "code-block",
    label: "Code block",
    description: "Syntax-highlighted code",
    icon: IconCode,
    keywords: ["code", "snippet", "formula", "vba", "sql"],
    group: "structure",
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    id: "bullet-list",
    label: "Bullet list",
    description: "Unordered list",
    icon: IconList,
    keywords: ["bullet", "unordered", "list", "ul"],
    group: "structure",
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    id: "arrow-list",
    label: "Arrow list",
    description: "List with ➤ markers",
    icon: IconCaretRight,
    keywords: ["arrow", "list", "bullet", "point", "marker", "triangular"],
    group: "structure",
    action: (editor) =>
      editor
        .chain()
        .focus()
        .insertContent({
          type: "bulletList",
          attrs: { marker: "arrow" },
          content: [{ type: "listItem", content: [{ type: "paragraph" }] }],
        })
        .run(),
  },
  {
    id: "ordered-list",
    label: "Ordered list",
    description: "Numbered list",
    icon: IconListNumbers,
    keywords: ["ordered", "numbered", "list", "ol"],
    group: "structure",
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    id: "divider",
    label: "Divider",
    description: "Horizontal rule",
    icon: IconMinus,
    keywords: ["divider", "hr", "rule", "separator", "line"],
    group: "structure",
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    id: "image",
    label: "Image…",
    description: "From URL or media library",
    icon: IconPhoto,
    keywords: ["image", "picture", "photo", "media"],
    group: "media",
    panel: "image",
  },
  {
    id: "embed",
    label: "Video embed…",
    description: "YouTube or Vimeo",
    icon: IconVideo,
    keywords: ["video", "youtube", "vimeo", "iframe", "embed"],
    group: "media",
    panel: "embed",
  },
  {
    id: "button",
    label: "Button…",
    description: "Call-to-action link button",
    icon: IconLink,
    keywords: ["button", "cta", "link", "download"],
    group: "advanced",
    panel: "button",
  },
  {
    id: "html",
    label: "HTML block…",
    description: "Raw sanitized HTML",
    icon: IconBrandHtml5,
    keywords: ["html", "raw", "iframe", "embed"],
    group: "advanced",
    panel: "html",
  },
  {
    id: "keyboard-keys",
    label: "Keyboard keys…",
    description: "Ctrl + S style key caps",
    icon: IconKeyboard,
    keywords: ["keyboard", "key", "keys", "kbd", "shortcut", "hotkey"],
    group: "advanced",
    panel: "keys",
  },
]
