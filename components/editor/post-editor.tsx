"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, useEditor, useEditorState, type JSONContent } from "@tiptap/react"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import { FontSize, TextStyle } from "@tiptap/extension-text-style"
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table"

import { AccordionNode } from "@/components/editor/accordion-node"
import { CtaButtonNode } from "@/components/editor/button-node"
import { CalloutNode } from "@/components/editor/callout-node"
import { CodeBlockLanguage } from "@/components/editor/code-block-language"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { EmbedNode } from "@/components/editor/embed-node"
import { HeadingNum } from "@/components/editor/heading-num"
import { HtmlBlock } from "@/components/editor/html-block"
import { KbdMark } from "@/components/editor/kbd-mark"
import { ListMarker } from "@/components/editor/list-marker"
import { SlashMenu } from "@/components/editor/slash-menu"
import type { Panel } from "@/components/editor/editor-toolbar"

interface PostEditorProps {
  initialDoc: JSONContent | null
  onDocChange: (doc: JSONContent) => void
}

const SizedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null },
      height: { default: null },
    }
  },
})

function countWords(text: string) {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

export function PostEditor({ initialDoc, onDocChange }: PostEditorProps) {
  const [insertPanel, setInsertPanel] = useState<Panel>(null)
  const loadedDocRef = useRef<JSONContent | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      CodeBlockLanguage,
      SizedImage.configure({ inline: false }),
      Placeholder.configure({
        placeholder: "Write your article… use the toolbar to add blocks.",
      }),
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      HtmlBlock,
      CalloutNode,
      CtaButtonNode,
      EmbedNode,
      AccordionNode,
      HeadingNum,
      KbdMark,
      ListMarker,
      SlashMenu.configure({ onOpenPanel: setInsertPanel }),
    ],
    content: initialDoc ?? { type: "doc", content: [{ type: "paragraph" }] },
    onUpdate: ({ editor }) => {
      onDocChange(editor.getJSON())
    },
  })

  useEffect(() => {
    if (!editor || !initialDoc || editor.isDestroyed) return
    if (loadedDocRef.current !== initialDoc) {
      loadedDocRef.current = initialDoc
      editor.commands.setContent(initialDoc, { emitUpdate: false })
    }
  }, [editor, initialDoc])

  const stats = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const text = instance ? instance.getText() : ""
      return { words: countWords(text), chars: text.length }
    },
  })

  if (!editor) {
    return <div className="h-96 animate-pulse rounded-xl border" />
  }

  const words = stats?.words ?? 0
  const chars = stats?.chars ?? 0
  const readingMinutes = Math.max(1, Math.ceil(words / 200))

  return (
    <div className="post-editor space-y-3">
      <EditorToolbar
        editor={editor}
        panel={insertPanel}
        onPanelChange={setInsertPanel}
      />
      <div className="min-h-96 rounded-xl border bg-card p-6">
        <EditorContent editor={editor} className="min-h-80" />
      </div>
      <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
        <span>
          {words.toLocaleString()} words · {chars.toLocaleString()} characters
        </span>
        {words > 0 ? <span>~{readingMinutes} min read</span> : null}
      </div>
    </div>
  )
}
