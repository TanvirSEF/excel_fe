"use client"

import { useState } from "react"
import type { Editor } from "@tiptap/react"
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBold,
  IconCode,
  IconEraser,
  IconItalic,
  IconLink,
  IconLinkOff,
  IconMinus,
  IconStrikethrough,
} from "@tabler/icons-react"

import { MediaPicker } from "@/components/editor/media-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const LANGUAGES = ["plaintext", "excel", "vba", "python", "sql"]

interface EditorToolbarProps {
  editor: Editor
}

type Panel = "image" | "html" | "link" | null

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [panel, setPanel] = useState<Panel>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [html, setHtml] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)

  const inCodeBlock = editor.isActive("codeBlock")

  function openPanel(next: Panel, prefetch?: () => void) {
    if (panel === next) {
      setPanel(null)
      return
    }
    prefetch?.()
    setPanel(next)
  }

  function applyLink() {
    const href = linkUrl.trim()
    if (!href) return
    const url = /^(https?:\/\/|mailto:|\/|#)/i.test(href) ? href : `https://${href}`
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    setLinkUrl("")
    setPanel(null)
  }

  return (
    <div className="space-y-2 rounded-xl border bg-muted/30 p-2">
      <div className="flex flex-wrap items-center gap-1">
        <ToolbarButton
          active={false}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <IconArrowBackUp className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={false}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Shift+Z)"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <IconArrowForwardUp className="h-4 w-4" />
        </ToolbarButton>
        <Divider />

        <ToolbarButton
          active={editor.isActive("paragraph") && !inCodeBlock}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Text
        </ToolbarButton>
        {([2, 3, 4] as const).map((level) => (
          <ToolbarButton
            key={level}
            active={editor.isActive("heading", { level })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
          >
            H{level}
          </ToolbarButton>
        ))}
        <Divider />

        <ToolbarButton
          active={editor.isActive("bold")}
          disabled={inCodeBlock}
          title="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <IconBold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          disabled={inCodeBlock}
          title="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <IconItalic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("strike")}
          disabled={inCodeBlock}
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <IconStrikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("code")}
          disabled={inCodeBlock}
          title="Inline code"
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <IconCode className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("link") || panel === "link"}
          disabled={inCodeBlock}
          title="Link (Ctrl+K)"
          onClick={() =>
            openPanel("link", () =>
              setLinkUrl(
                (editor.getAttributes("link").href as string | undefined) ?? ""
              )
            )
          }
        >
          <IconLink className="h-4 w-4" />
        </ToolbarButton>
        {editor.isActive("link") ? (
          <ToolbarButton
            active={false}
            title="Remove link"
            onClick={() =>
              editor.chain().focus().extendMarkRange("link").unsetLink().run()
            }
          >
            <IconLinkOff className="h-4 w-4" />
          </ToolbarButton>
        ) : null}
        <ToolbarButton
          active={false}
          disabled={inCodeBlock}
          title="Clear formatting"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <IconEraser className="h-4 w-4" />
        </ToolbarButton>
        <Divider />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet list
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Ordered list
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </ToolbarButton>
        <ToolbarButton
          active={inCodeBlock}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code
        </ToolbarButton>
        <Divider />

        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          disabled={inCodeBlock}
          title="Align left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <IconAlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          disabled={inCodeBlock}
          title="Align center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <IconAlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          disabled={inCodeBlock}
          title="Align right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <IconAlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={false}
          disabled={inCodeBlock}
          title="Divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <IconMinus className="h-4 w-4" />
        </ToolbarButton>
        <Divider />

        <ToolbarButton
          active={panel === "image"}
          onClick={() => openPanel("image")}
        >
          Image
        </ToolbarButton>
        <ToolbarButton
          active={panel === "html"}
          onClick={() => openPanel("html")}
        >
          HTML
        </ToolbarButton>
        <ToolbarButton
          active={false}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          Table
        </ToolbarButton>

        {inCodeBlock ? (
          <>
            <Divider />
            <select
              value={
                (editor.getAttributes("codeBlock").language as string) ??
                "plaintext"
              }
              onChange={(event) =>
                editor
                  .chain()
                  .focus()
                  .updateAttributes("codeBlock", {
                    language: event.target.value,
                  })
                  .run()
              }
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              {LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </>
        ) : null}
      </div>

      {panel === "link" ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-2">
          <Input
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                applyLink()
              }
            }}
            placeholder="https://example.com — press Enter to apply"
            className="h-8 flex-1 min-w-48"
            autoFocus
          />
          <Button type="button" size="sm" disabled={!linkUrl.trim()} onClick={applyLink}>
            Apply
          </Button>
          {editor.isActive("link") ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                editor.chain().focus().extendMarkRange("link").unsetLink().run()
                setPanel(null)
              }}
            >
              Remove
            </Button>
          ) : null}
        </div>
      ) : null}

      {panel === "image" ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-2">
          <Input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="Image URL"
            className="h-8 flex-1 min-w-48"
          />
          <Input
            value={imageAlt}
            onChange={(event) => setImageAlt(event.target.value)}
            placeholder="Alt text"
            className="h-8 flex-1 min-w-48"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            Library
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!imageUrl}
            onClick={() => {
              editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run()
              setImageUrl("")
              setImageAlt("")
              setPanel(null)
            }}
          >
            Insert
          </Button>
          <MediaPicker
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            onSelect={(item) => {
              editor
                .chain()
                .focus()
                .setImage({ src: item.file_url, alt: item.alt_text ?? "" })
                .run()
              setPanel(null)
            }}
          />
        </div>
      ) : null}

      {panel === "html" ? (
        <div className="space-y-2 rounded-lg border bg-background p-2">
          <textarea
            value={html}
            onChange={(event) => setHtml(event.target.value)}
            placeholder='<iframe src="…"></iframe> or any raw HTML'
            rows={3}
            className="w-full rounded-md border border-input bg-background p-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
          <Button
            type="button"
            size="sm"
            disabled={!html}
            onClick={() => {
              editor
                .chain()
                .focus()
                .insertContent({ type: "htmlBlock", attrs: { html } })
                .run()
              setHtml("")
              setPanel(null)
            }}
          >
            Insert HTML block
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function ToolbarButton({
  active,
  onClick,
  children,
  disabled = false,
  title,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={cn(
        "flex h-8 items-center justify-center rounded-md px-2.5 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" aria-hidden />
}
