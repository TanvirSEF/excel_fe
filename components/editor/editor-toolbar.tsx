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
  IconHighlight,
  IconItalic,
  IconLink,
  IconLinkOff,
  IconMinus,
  IconPalette,
  IconStrikethrough,
} from "@tabler/icons-react"

import { MediaPicker } from "@/components/editor/media-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ButtonVariant } from "@/types/api"

const LANGUAGES = ["plaintext", "excel", "vba", "python", "sql"]

const FONT_SIZES = [
  { value: "", label: "Normal" },
  { value: "14px", label: "Small 14" },
  { value: "20px", label: "Large 20" },
  { value: "28px", label: "Huge 28" },
]

const TEXT_COLORS = [
  "#0d9488",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#16a34a",
  "#0ea5e9",
  "#334155",
]

const HIGHLIGHT_COLORS = [
  "#fef9c3",
  "#dcfce7",
  "#dbeafe",
  "#fee2e2",
  "#f3e8ff",
  "#e2e8f0",
]

interface EditorToolbarProps {
  editor: Editor
}

type Panel =
  | "image"
  | "html"
  | "link"
  | "fontsize"
  | "color"
  | "highlight"
  | "button"
  | "embed"
  | null

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [panel, setPanel] = useState<Panel>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [html, setHtml] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const [customFontSize, setCustomFontSize] = useState("")
  const [customColor, setCustomColor] = useState("")
  const [buttonLabel, setButtonLabel] = useState("")
  const [buttonHref, setButtonHref] = useState("")
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("primary")
  const [embedUrl, setEmbedUrl] = useState("")
  const [embedCaption, setEmbedCaption] = useState("")

  const inCodeBlock = editor.isActive("codeBlock")
  const currentFontSize =
    (editor.getAttributes("textStyle").fontSize as string | undefined) ?? ""
  const currentColor =
    (editor.getAttributes("textStyle").color as string | undefined) ?? ""

  function openPanel(next: Panel, prefetch?: () => void) {
    if (panel === next) {
      setPanel(null)
      return
    }
    prefetch?.()
    setPanel(next)
  }

  function applyFontSize(value: string) {
    const chain = editor.chain().focus()
    if (!value) {
      chain.unsetFontSize().run()
      return
    }
    if (value === "custom") {
      openPanel("fontsize")
      return
    }
    chain.setFontSize(value).run()
  }

  function applyCustomFontSize() {
    const raw = customFontSize.trim()
    if (!raw) return
    const value = /^\d+(\.\d+)?$/.test(raw) ? `${raw}px` : raw
    if (!/^\d{1,3}(\.\d+)?(px|pt|rem|em|%)$/.test(value)) return
    editor.chain().focus().setFontSize(value).run()
    setCustomFontSize("")
    setPanel(null)
  }

  function applyColor(hex: string) {
    editor.chain().focus().setColor(hex).run()
    setPanel(null)
  }

  function applyHighlight(hex: string | null) {
    const chain = editor.chain().focus()
    if (hex) {
      chain.setHighlight({ color: hex }).run()
    } else {
      chain.unsetHighlight().run()
    }
    setPanel(null)
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
          active={panel === "color" || Boolean(currentColor)}
          disabled={inCodeBlock}
          title="Text color"
          onClick={() => openPanel("color", () => setCustomColor(""))}
        >
          <IconPalette className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={panel === "highlight" || editor.isActive("highlight")}
          disabled={inCodeBlock}
          title="Highlight"
          onClick={() => openPanel("highlight")}
        >
          <IconHighlight className="h-4 w-4" />
        </ToolbarButton>
        <select
          value={
            FONT_SIZES.some((size) => size.value === currentFontSize)
              ? currentFontSize
              : currentFontSize
                ? "custom"
                : ""
          }
          disabled={inCodeBlock}
          onChange={(event) => applyFontSize(event.target.value)}
          title="Font size"
          className="h-8 rounded-md border border-input bg-background px-2 text-xs disabled:pointer-events-none disabled:opacity-40"
        >
          {FONT_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
          <option value="custom">
            {currentFontSize && !FONT_SIZES.some((s) => s.value === currentFontSize)
              ? `Custom ${currentFontSize}`
              : "Custom…"}
          </option>
        </select>
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
        <ToolbarButton
          active={false}
          title="Info / tip / warning / danger box"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: "callout",
                attrs: { variant: "info", title: "" },
                content: [{ type: "paragraph" }],
              })
              .run()
          }
        >
          Callout
        </ToolbarButton>
        <ToolbarButton
          active={panel === "button"}
          title="Styled link button"
          onClick={() => openPanel("button")}
        >
          Button
        </ToolbarButton>
        <ToolbarButton
          active={panel === "embed"}
          title="YouTube / Vimeo video"
          onClick={() => openPanel("embed")}
        >
          Embed
        </ToolbarButton>
        <ToolbarButton
          active={false}
          title="Collapsible FAQ section"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: "accordion",
                attrs: { title: "" },
                content: [{ type: "paragraph" }],
              })
              .run()
          }
        >
          Accordion
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

      {panel === "fontsize" ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-2">
          <Input
            type="text"
            inputMode="decimal"
            value={customFontSize}
            onChange={(event) => setCustomFontSize(event.target.value)}
            placeholder="Custom size — e.g. 18 or 1.2rem"
            className="h-8 w-56"
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                applyCustomFontSize()
              }
            }}
          />
          <Button type="button" size="sm" onClick={applyCustomFontSize}>
            Apply size
          </Button>
        </div>
      ) : null}

      {panel === "color" ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {TEXT_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                title={hex}
                onClick={() => applyColor(hex)}
                className="h-6 w-6 rounded-md border border-border/60 transition-transform hover:scale-110"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <Input
            type="text"
            value={customColor}
            onChange={(event) => setCustomColor(event.target.value)}
            placeholder="#hex"
            className="h-8 w-28 font-mono"
          />
          <Button
            type="button"
            size="sm"
            disabled={!/^#[0-9a-fA-F]{3,8}$/.test(customColor.trim())}
            onClick={() => applyColor(customColor.trim())}
          >
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              editor.chain().focus().unsetColor().run()
              setPanel(null)
            }}
          >
            Reset
          </Button>
        </div>
      ) : null}

      {panel === "highlight" ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {HIGHLIGHT_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                title={hex}
                onClick={() => applyHighlight(hex)}
                className="h-6 w-6 rounded-md border border-border/60 transition-transform hover:scale-110"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyHighlight(null)}
          >
            Remove highlight
          </Button>
        </div>
      ) : null}

      {panel === "button" ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-2">
          <Input
            value={buttonLabel}
            onChange={(event) => setButtonLabel(event.target.value)}
            placeholder="Button label"
            className="h-8 flex-1 min-w-40"
            autoFocus
          />
          <Input
            type="url"
            value={buttonHref}
            onChange={(event) => setButtonHref(event.target.value)}
            placeholder="https://link"
            className="h-8 flex-1 min-w-48"
          />
          <select
            value={buttonVariant}
            onChange={(event) =>
              setButtonVariant(event.target.value as ButtonVariant)
            }
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="primary">Primary</option>
            <option value="outline">Outline</option>
          </select>
          <Button
            type="button"
            size="sm"
            disabled={!buttonLabel.trim() || !buttonHref.trim()}
            onClick={() => {
              const href = /^(https?:\/\/|mailto:|\/|#)/i.test(buttonHref.trim())
                ? buttonHref.trim()
                : `https://${buttonHref.trim()}`
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "ctaButton",
                  attrs: {
                    label: buttonLabel.trim(),
                    href,
                    variant: buttonVariant,
                  },
                })
                .run()
              setButtonLabel("")
              setButtonHref("")
              setButtonVariant("primary")
              setPanel(null)
            }}
          >
            Insert button
          </Button>
        </div>
      ) : null}

      {panel === "embed" ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-2">
          <Input
            type="url"
            value={embedUrl}
            onChange={(event) => setEmbedUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="h-8 flex-1 min-w-48"
            autoFocus
          />
          <Input
            value={embedCaption}
            onChange={(event) => setEmbedCaption(event.target.value)}
            placeholder="Caption (optional)"
            className="h-8 flex-1 min-w-40"
          />
          <Button
            type="button"
            size="sm"
            disabled={!embedUrl.trim().startsWith("https://")}
            onClick={() => {
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "embed",
                  attrs: {
                    url: embedUrl.trim(),
                    caption: embedCaption.trim(),
                  },
                })
                .run()
              setEmbedUrl("")
              setEmbedCaption("")
              setPanel(null)
            }}
          >
            Insert video
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
