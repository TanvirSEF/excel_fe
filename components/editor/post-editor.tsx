"use client"

import { EditorContent, useEditor, type JSONContent } from "@tiptap/react"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table"

import { CodeBlockLanguage } from "@/components/editor/code-block-language"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { HtmlBlock } from "@/components/editor/html-block"

interface PostEditorProps {
  initialDoc: JSONContent | null
  onDocChange: (doc: JSONContent) => void
}

export function PostEditor({ initialDoc, onDocChange }: PostEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        strike: false,
        code: false,
        codeBlock: false,
        hardBreak: false,
        horizontalRule: false,
        link: false,
      }),
      CodeBlockLanguage,
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: "Write your article… use the toolbar to add blocks.",
      }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      HtmlBlock,
    ],
    content: initialDoc ?? { type: "doc", content: [{ type: "paragraph" }] },
    onUpdate: ({ editor }) => {
      onDocChange(editor.getJSON())
    },
  })

  if (!editor) {
    return <div className="h-96 animate-pulse rounded-xl border" />
  }

  return (
    <div className="post-editor space-y-3">
      <EditorToolbar editor={editor} />
      <div className="min-h-96 rounded-xl border bg-card p-6">
        <EditorContent editor={editor} className="min-h-80" />
      </div>
    </div>
  )
}
