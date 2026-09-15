"use client"

import { Fragment, type ReactNode } from "react"
import { IconHelpCircle } from "@tabler/icons-react"

import {
  BLOCK_COMMANDS,
  BLOCK_GROUPS,
} from "@/components/editor/block-commands"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const SHORTCUTS: { keys: string[]; action: string }[] = [
  { keys: ["/"], action: "Open the block menu" },
  { keys: ["Ctrl", "B"], action: "Bold" },
  { keys: ["Ctrl", "I"], action: "Italic" },
  { keys: ["Ctrl", "E"], action: "Inline code" },
  { keys: ["Ctrl", "K"], action: "Link" },
  { keys: ["Ctrl", "Shift", "H"], action: "Highlight" },
  { keys: ["Ctrl", "Z"], action: "Undo" },
  { keys: ["Ctrl", "Y"], action: "Redo" },
]

const INPUT_RULES: { input: string; action: string }[] = [
  { input: "## ", action: "Heading" },
  { input: "> ", action: "Quote" },
  { input: "- ", action: "Bullet list" },
  { input: "1. ", action: "Ordered list" },
  { input: "```", action: "Code block" },
]

function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium shadow-xs">
      {children}
    </kbd>
  )
}

export function EditorGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Editor guide"
          aria-label="Editor guide"
          className="flex h-8 items-center justify-center rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <IconHelpCircle className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editor guide</DialogTitle>
          <DialogDescription>
            Everything you can insert and every shortcut.
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Insert blocks</h3>
          <p className="text-sm text-muted-foreground">
            Type <Key>/</Key> in the editor, or use the Insert menu in the
            toolbar.
          </p>
          {BLOCK_GROUPS.map((group) => (
            <div key={group.id} className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {group.label}
              </p>
              <ul className="space-y-1">
                {BLOCK_COMMANDS.filter((item) => item.group === group.id).map(
                  (item) => (
                    <li key={item.id} className="flex items-center gap-2 text-sm">
                      <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium">{item.label}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        — {item.description}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Keyboard shortcuts</h3>
          <ul className="space-y-1.5">
            {SHORTCUTS.map((shortcut) => (
              <li
                key={shortcut.action}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="text-muted-foreground">{shortcut.action}</span>
                <span className="flex shrink-0 items-center gap-1">
                  {shortcut.keys.map((key, index) => (
                    <Fragment key={key}>
                      {index > 0 ? (
                        <span className="text-xs text-muted-foreground">+</span>
                      ) : null}
                      <Key>{key}</Key>
                    </Fragment>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Type to transform</h3>
          <ul className="space-y-1.5">
            {INPUT_RULES.map((rule) => (
              <li
                key={rule.input}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="text-muted-foreground">{rule.action}</span>
                <Key>{rule.input}</Key>
              </li>
            ))}
          </ul>
        </section>
      </DialogContent>
    </Dialog>
  )
}
