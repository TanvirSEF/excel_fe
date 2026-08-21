"use client"

import { useState } from "react"
import type { Editor } from "@tiptap/react"

import { MediaPicker } from "@/components/editor/media-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const LANGUAGES = ["plaintext", "excel", "vba", "python", "sql"]

interface EditorToolbarProps {
  editor: Editor
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [panel, setPanel] = useState<"image" | "html" | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [html, setHtml] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)

  const inCodeBlock = editor.isActive("codeBlock")

  return (
    <div className="space-y-2 rounded-xl border bg-muted/30 p-2">
      <div className="flex flex-wrap items-center gap-1">
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
          active={panel === "image"}
          onClick={() => setPanel(panel === "image" ? null : "image")}
        >
          Image
        </ToolbarButton>
        <ToolbarButton
          active={panel === "html"}
          onClick={() => setPanel(panel === "html" ? null : "html")}
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
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-md px-2.5 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" aria-hidden />
}
