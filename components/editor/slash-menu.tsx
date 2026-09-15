"use client"

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react"
import { Extension } from "@tiptap/core"
import { ReactRenderer } from "@tiptap/react"
import {
  Suggestion,
  exitSuggestion,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion"

import {
  BLOCK_COMMANDS,
  BLOCK_GROUPS,
  type BlockCommand,
  type BlockPanel,
} from "@/components/editor/block-commands"
import { cn } from "@/lib/utils"

interface SlashMenuOptions {
  onOpenPanel: (panel: BlockPanel) => void
}

interface PaletteHandle {
  onKeyDown: (event: KeyboardEvent) => boolean
}

interface PaletteProps {
  query: string
  items: BlockCommand[]
  command: (item: BlockCommand) => void
  ref?: Ref<PaletteHandle>
}

type PaletteRow =
  | { kind: "label"; key: string; label: string }
  | { kind: "item"; key: string; item: BlockCommand; flatIndex: number }

function filterCommands(query: string): BlockCommand[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return BLOCK_COMMANDS
  return BLOCK_COMMANDS.filter((item) => {
    const group = BLOCK_GROUPS.find((entry) => entry.id === item.group)
    const haystack = [
      item.label,
      item.description,
      group?.label ?? "",
      ...item.keywords,
    ]
      .join(" ")
      .toLowerCase()
    return haystack.includes(needle)
  })
}

function buildRows(items: BlockCommand[]): PaletteRow[] {
  const rows: PaletteRow[] = []
  let flatIndex = 0
  for (const group of BLOCK_GROUPS) {
    const groupItems = items.filter((item) => item.group === group.id)
    if (groupItems.length === 0) continue
    rows.push({ kind: "label", key: `group-${group.id}`, label: group.label })
    for (const item of groupItems) {
      rows.push({ kind: "item", key: item.id, item, flatIndex })
      flatIndex += 1
    }
  }
  return rows
}

function SlashMenuPalette({ ref, query, items, command }: PaletteProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [prevQuery, setPrevQuery] = useState(query)

  if (prevQuery !== query) {
    setPrevQuery(query)
    setSelectedIndex(0)
  }

  useEffect(() => {
    containerRef.current
      ?.querySelector(`[data-index="${selectedIndex}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [selectedIndex])

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: (event) => {
        if (items.length === 0) return false
        if (event.key === "ArrowDown") {
          setSelectedIndex((index) => (index + 1) % items.length)
          return true
        }
        if (event.key === "ArrowUp") {
          setSelectedIndex((index) => (index - 1 + items.length) % items.length)
          return true
        }
        if (event.key === "Enter" || event.key === "Tab") {
          command(items[selectedIndex])
          return true
        }
        return false
      },
    }),
    [items, selectedIndex, command]
  )

  if (items.length === 0) {
    return (
      <div className="w-64 rounded-lg border bg-popover p-3 text-sm text-muted-foreground shadow-md">
        No matching blocks
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="z-50 max-h-80 w-64 overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
    >
      {buildRows(items).map((row) =>
        row.kind === "label" ? (
          <div
            key={row.key}
            className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
          >
            {row.label}
          </div>
        ) : (
          <button
            key={row.key}
            type="button"
            data-index={row.flatIndex}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => command(row.item)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
              row.flatIndex === selectedIndex
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent"
            )}
          >
            <row.item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate">{row.item.label}</span>
              <span className="truncate text-xs text-muted-foreground">
                {row.item.description}
              </span>
            </span>
          </button>
        )
      )}
    </div>
  )
}

export const SlashMenu = Extension.create<SlashMenuOptions>({
  name: "slashMenu",

  addOptions() {
    return {
      onOpenPanel: () => {},
    }
  },

  addProseMirrorPlugins() {
    const { onOpenPanel } = this.options

    return [
      Suggestion<BlockCommand, BlockCommand>({
        editor: this.editor,
        char: "/",
        placement: "bottom-start",
        offset: { mainAxis: 6 },
        dismissOnOutsideClick: true,
        allow: ({ state }) => {
          const $from = state.selection.$from
          if ($from.parent.type.spec.code) return false
          if ($from.marks().some((mark) => mark.type.name === "code")) {
            return false
          }
          return true
        },
        items: ({ query }) => filterCommands(query),
        command: ({ editor, range, props: item }) => {
          editor.chain().focus().deleteRange(range).run()
          if (item.panel) {
            onOpenPanel(item.panel)
            return
          }
          item.action?.(editor)
        },
        render: () => {
          let component: ReactRenderer<PaletteHandle, PaletteProps> | null = null
          let unmount: (() => void) | null = null

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashMenuPalette, {
                editor: props.editor,
                props: {
                  query: props.query,
                  items: props.items,
                  command: props.command,
                },
              })
              unmount = props.mount(component.element)
            },
            onUpdate: (props) => {
              component?.updateProps({
                query: props.query,
                items: props.items,
                command: props.command,
              })
            },
            onKeyDown: (props: SuggestionKeyDownProps) => {
              if (props.event.key === "Escape") {
                exitSuggestion(props.view)
                return true
              }
              return component?.ref?.onKeyDown(props.event) ?? false
            },
            onExit: () => {
              unmount?.()
              component?.destroy()
              component = null
              unmount = null
            },
          }
        },
      }),
    ]
  },
})
