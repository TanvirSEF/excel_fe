import type { InlineMark, InlineText, RichText } from "@/types/api"

export function cleanRichText(value: RichText | undefined): RichText {
  if (!value) return ""
  if (typeof value === "string") return value.trim()

  const runs: InlineText[] = value.map((r) => ({ ...r }))

  while (runs.length > 0 && !runs[0].text.trim()) {
    runs.shift()
  }
  if (runs.length === 0) return runs

  runs[0] = { ...runs[0], text: runs[0].text.replace(/^[\s\r\n]+/, "") }
  if (!runs[0].text) {
    runs.shift()
  }

  while (runs.length > 0 && !runs[runs.length - 1].text.trim()) {
    runs.pop()
  }
  if (runs.length === 0) return runs

  const lastIdx = runs.length - 1
  runs[lastIdx] = {
    ...runs[lastIdx],
    text: runs[lastIdx].text.replace(/[\s\r\n]+$/, ""),
  }
  if (!runs[lastIdx].text) {
    runs.pop()
  }

  // Merge adjacent runs with identical marks
  const merged: InlineText[] = []
  for (const r of runs) {
    if (!r.text) continue
    const prev = merged[merged.length - 1]
    const rMarks = r.marks ?? []
    const prevMarks = prev?.marks ?? []
    const isSameMarks =
      Boolean(prev) &&
      rMarks.length === prevMarks.length &&
      rMarks.every(
        (m, idx) =>
          m.type === prevMarks[idx]?.type &&
          m.color === prevMarks[idx]?.color &&
          m.href === prevMarks[idx]?.href
      )
    if (isSameMarks && prev) {
      prev.text += r.text
    } else {
      merged.push({ ...r, marks: r.marks ? [...r.marks] : undefined })
    }
  }

  // Collapse 2+ newlines within any run to at most 1 newline
  for (let i = 0; i < merged.length; i++) {
    merged[i].text = merged[i].text.replace(/\n{2,}/g, "\n")
  }

  // Collapse newlines across adjacent run boundaries so combined newlines never exceed \n
  for (let i = 0; i < merged.length - 1; i++) {
    if (merged[i].text.endsWith("\n") && merged[i + 1].text.startsWith("\n")) {
      merged[i + 1].text = merged[i + 1].text.replace(/^\n+/, "")
    }
  }

  return merged
}

export function cleanNoteContent(
  value: RichText | undefined,
  title?: string
): RichText {
  if (!value) return ""

  const isMatch = (str: string) => {
    const t = str.trim()
    if (!t) return false
    if (/^notes?:?\s*/i.test(t)) return true
    if (
      title &&
      new RegExp(
        "^" + title.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + ":?\\s*",
        "i"
      ).test(t)
    ) {
      return true
    }
    return false
  }

  const strip = (str: string) => {
    let res = str.replace(/^[\s\r\n]*notes?:?\s*/i, "")
    if (title) {
      res = res.replace(
        new RegExp(
          "^[\\s\\r\\n]*" +
            title.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") +
            ":?\\s*",
          "i"
        ),
        ""
      )
    }
    return res
  }

  if (typeof value === "string") {
    return strip(value).trim()
  }

  const runs: InlineText[] = value.map((r) => ({ ...r }))
  while (runs.length > 0 && !runs[0].text.trim()) {
    runs.shift()
  }
  if (runs.length === 0) return runs

  if (isMatch(runs[0].text)) {
    const stripped = strip(runs[0].text).trimStart()
    if (stripped) {
      runs[0] = { ...runs[0], text: stripped }
    } else {
      runs.shift()
    }
  }

  return cleanRichText(runs)
}

const SHORTCUT_REGEX =
  /\b(Ctrl|Control|Alt|Option|Shift|Cmd|Command|Win|Windows)(?:[\s\u00a0]*\+[\s\u00a0]*(?:Ctrl|Control|Alt|Option|Shift|Cmd|Command|Win|Windows|F1[0-2]|F[1-9]|Enter|Return|Esc|Escape|Tab|Space|Spacebar|Backspace|Delete|Del|Insert|Ins|Home|End|Page[\s\u00a0]*Up|Page[\s\u00a0]*Down|PgUp|PgDn|Up[\s\u00a0]*Arrow|Down[\s\u00a0]*Arrow|Left[\s\u00a0]*Arrow|Right[\s\u00a0]*Arrow|Arrow[\s\u00a0]*Up|Arrow[\s\u00a0]*Down|Arrow[\s\u00a0]*Left|Arrow[\s\u00a0]*Right|Plus|Minus|[A-Za-z0-9]|[;':",.<>\/?\\`~=\-_+]))+/gi

const MODIFIER_NAMES = new Set([
  "ctrl",
  "control",
  "alt",
  "option",
  "shift",
  "cmd",
  "command",
  "win",
  "windows",
])

const VALID_KEY_NAMES = new Set([
  "ctrl",
  "control",
  "alt",
  "option",
  "shift",
  "cmd",
  "command",
  "win",
  "windows",
  "enter",
  "return",
  "esc",
  "escape",
  "tab",
  "space",
  "spacebar",
  "backspace",
  "delete",
  "del",
  "insert",
  "ins",
  "home",
  "end",
  "pageup",
  "pagedown",
  "page up",
  "page down",
  "pgup",
  "pgdn",
  "uparrow",
  "downarrow",
  "leftarrow",
  "rightarrow",
  "up arrow",
  "down arrow",
  "left arrow",
  "right arrow",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "plus",
  "minus",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "f9",
  "f10",
  "f11",
  "f12",
])

function cleanKeyText(str: string): string {
  return str.trim().replace(/^[\u00a0\s]+|[\u00a0\s]+$/g, "")
}

function isModifier(str: string): boolean {
  return MODIFIER_NAMES.has(cleanKeyText(str).toLowerCase())
}

function isKey(str: string): boolean {
  const clean = cleanKeyText(str).toLowerCase()
  if (VALID_KEY_NAMES.has(clean)) return true
  if (/^[a-z0-9]$/i.test(clean)) return true
  if (/^[;':",.<>\/?\\`~=\-_+]$/.test(clean)) return true
  return false
}

function parseShortcutKeys(shortcutStr: string): string[] {
  const str = shortcutStr.replace(/[\u00a0]/g, " ").trim()
  const matchPlus = str.match(/\+\s*\+$/)
  if (matchPlus && matchPlus.index !== undefined) {
    const prefix = str.slice(0, matchPlus.index)
    const prefixKeys = prefix
      .split(/\s*\+\s*/)
      .filter(Boolean)
      .map(cleanKeyText)
    return [...prefixKeys, "+"]
  }
  return str
    .split(/\s*\+\s*/)
    .filter(Boolean)
    .map(cleanKeyText)
}

export function formatShortcuts(value: RichText | undefined): InlineText[] {
  if (!value) return []
  const initialRuns: InlineText[] =
    typeof value === "string" ? [{ text: value }] : value.map((r) => ({ ...r }))

  if (initialRuns.length === 0) return initialRuns

  const intermediate: InlineText[] = []
  let i = 0
  while (i < initialRuns.length) {
    const cur = initialRuns[i]
    const curTrimmed = cleanKeyText(cur.text || "")

    if (
      isModifier(curTrimmed) &&
      i + 2 < initialRuns.length &&
      cleanKeyText(initialRuns[i + 1].text || "") === "+" &&
      isKey(initialRuns[i + 2].text || "")
    ) {
      let j = i
      const chainKeys: InlineText[] = []
      while (
        j < initialRuns.length &&
        ((chainKeys.length === 0 && isModifier(initialRuns[j].text || "")) ||
          (chainKeys.length > 0 &&
            j + 1 < initialRuns.length &&
            cleanKeyText(initialRuns[j].text || "") === "+" &&
            isKey(initialRuns[j + 1].text || "")))
      ) {
        if (chainKeys.length === 0) {
          chainKeys.push(initialRuns[j])
          j++
        } else {
          chainKeys.push(initialRuns[j + 1])
          j += 2
        }
      }

      chainKeys.forEach((keyRun, idx) => {
        if (idx > 0) {
          intermediate.push({ text: " + " })
        }
        const marks: InlineMark[] = [
          ...(keyRun.marks || []).filter((m) => m.type !== "kbd"),
          { type: "kbd" },
        ]
        intermediate.push({ text: cleanKeyText(keyRun.text), marks })
      })

      i = j
      continue
    }

    intermediate.push(cur)
    i++
  }

  const result: InlineText[] = []
  for (const run of intermediate) {
    if (run.marks?.some((m) => m.type === "kbd")) {
      if (run.text.includes("+")) {
        const keys = parseShortcutKeys(run.text)
        const otherMarks = run.marks.filter((m) => m.type !== "kbd")
        const kbdMarks: InlineMark[] = [...otherMarks, { type: "kbd" }]
        keys.forEach((key, idx) => {
          if (idx > 0) {
            result.push({
              text: " + ",
              marks: otherMarks.length > 0 ? otherMarks : undefined,
            })
          }
          result.push({ text: key, marks: kbdMarks })
        })
      } else {
        result.push({ ...run, text: cleanKeyText(run.text) })
      }
      continue
    }

    if (run.marks?.some((m) => m.type === "code" || m.type === "link")) {
      result.push(run)
      continue
    }

    const text = run.text || ""
    SHORTCUT_REGEX.lastIndex = 0
    if (!text || !SHORTCUT_REGEX.test(text)) {
      result.push(run)
      continue
    }

    SHORTCUT_REGEX.lastIndex = 0
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = SHORTCUT_REGEX.exec(text)) !== null) {
      const matchStart = match.index
      const matchEnd = SHORTCUT_REGEX.lastIndex

      if (matchStart > lastIndex) {
        result.push({
          text: text.slice(lastIndex, matchStart),
          marks: run.marks,
        })
      }

      const shortcutText = match[0]
      const keys = parseShortcutKeys(shortcutText)
      const otherMarks = (run.marks || []).filter((m) => m.type !== "kbd")
      const kbdMarks: InlineMark[] = [...otherMarks, { type: "kbd" }]

      keys.forEach((key, kIdx) => {
        if (kIdx > 0) {
          result.push({
            text: " + ",
            marks: otherMarks.length > 0 ? otherMarks : undefined,
          })
        }
        result.push({ text: key, marks: kbdMarks })
      })

      lastIndex = matchEnd
    }

    if (lastIndex < text.length) {
      result.push({
        text: text.slice(lastIndex),
        marks: run.marks,
      })
    }
  }

  return result
}

const FENCED_CODE_REGEX = /```([a-zA-Z0-9_#-]*)\r?\n([\s\S]*?)```/g

interface CodeBlockItem {
  type: "code"
  code: string
  language?: string
}

interface InlineItem {
  type: "inline"
  text: string
  marks?: InlineMark[]
}

type ProcessedRunItem = CodeBlockItem | InlineItem

function isCodeBlockRun(run: InlineText): boolean {
  if (run.marks?.some((m) => m.type === "code")) {
    const text = run.text.replace(/\r\n/g, "\n")
    if (text.trim().includes("\n")) {
      return true
    }
    if (/\b(Sub|Function)\b[\s\S]+\b(End Sub|End Function)\b/i.test(text)) {
      return true
    }
    if (/^```([a-zA-Z0-9_#-]*)\r?\n?([\s\S]*?)```$/.test(text.trim())) {
      return true
    }
  }
  return false
}

function extractCodeAndLanguage(text: string): {
  code: string
  language?: string
} {
  const trimmed = text.trim()
  const fenceMatch = trimmed.match(/^```([a-zA-Z0-9_#-]*)\r?\n?([\s\S]*?)```$/)
  if (fenceMatch) {
    return {
      language: fenceMatch[1] || undefined,
      code: fenceMatch[2].replace(/\r\n/g, "\n").trim(),
    }
  }
  return {
    code: text.replace(/\r\n/g, "\n").trim(),
  }
}

export function processRichTextItems(runs: InlineText[]): ProcessedRunItem[] {
  const items: ProcessedRunItem[] = []

  for (const run of runs) {
    if (isCodeBlockRun(run)) {
      const { code, language } = extractCodeAndLanguage(run.text)
      items.push({ type: "code", code, language })
      continue
    }

    if (run.text.includes("```")) {
      FENCED_CODE_REGEX.lastIndex = 0
      let lastIndex = 0
      let match: RegExpExecArray | null
      while ((match = FENCED_CODE_REGEX.exec(run.text)) !== null) {
        const before = run.text.slice(lastIndex, match.index)
        if (before) {
          items.push({ type: "inline", text: before, marks: run.marks })
        }
        items.push({
          type: "code",
          code: match[2].trim(),
          language: match[1] || undefined,
        })
        lastIndex = FENCED_CODE_REGEX.lastIndex
      }
      const after = run.text.slice(lastIndex)
      if (after) {
        items.push({ type: "inline", text: after, marks: run.marks })
      }
      continue
    }

    items.push({ type: "inline", text: run.text, marks: run.marks })
  }

  for (let i = 0; i < items.length; i++) {
    if (items[i].type === "code") {
      let prevIdx = i - 1
      while (prevIdx >= 0 && items[prevIdx].type === "inline") {
        const item = items[prevIdx] as InlineItem
        item.text = item.text.replace(/[\r\n]+$/, "")
        if (item.text.length > 0) {
          break
        }
        prevIdx--
      }

      let nextIdx = i + 1
      while (nextIdx < items.length && items[nextIdx].type === "inline") {
        const item = items[nextIdx] as InlineItem
        item.text = item.text.replace(/^[\r\n]+/, "")
        if (item.text.length > 0) {
          break
        }
        nextIdx++
      }
    }
  }

  const mergedItems: ProcessedRunItem[] = []
  for (const item of items) {
    if (item.type !== "inline") {
      mergedItems.push(item)
      continue
    }
    const prev = mergedItems[mergedItems.length - 1]
    if (prev && prev.type === "inline") {
      const prevMarks = prev.marks ?? []
      const itemMarks = item.marks ?? []
      const isSameMarks =
        prevMarks.length === itemMarks.length &&
        prevMarks.every(
          (m, idx) =>
            m.type === itemMarks[idx]?.type &&
            m.color === itemMarks[idx]?.color &&
            m.href === itemMarks[idx]?.href
        )
      if (isSameMarks) {
        prev.text += item.text
        continue
      }
    }
    mergedItems.push({ ...item })
  }

  return mergedItems
}

export function hasCodeBlock(value: RichText | undefined): boolean {
  if (!value) return false
  if (typeof value === "string") {
    return value.includes("```")
  }
  for (const run of value) {
    if (run.text.includes("```")) return true
    if (isCodeBlockRun(run)) return true
  }
  return false
}

export function extractLeadingArrow(content: RichText | undefined): {
  isStep: boolean
  cleaned: RichText
} {
  if (!content) return { isStep: false, cleaned: "" }

  if (typeof content === "string") {
    const trimmed = content.trimStart()
    if (trimmed.startsWith("➤")) {
      const withoutArrow = trimmed.replace(/^➤\s*/, "")
      return { isStep: true, cleaned: withoutArrow }
    }
    return { isStep: false, cleaned: content }
  }

  if (Array.isArray(content) && content.length > 0) {
    const firstText = content[0].text || ""
    const trimmed = firstText.trimStart()
    if (trimmed.startsWith("➤")) {
      const withoutArrow = trimmed.replace(/^➤\s*/, "")
      const newRuns = [...content]
      if (withoutArrow) {
        newRuns[0] = { ...newRuns[0], text: withoutArrow }
      } else {
        newRuns.shift()
      }
      return { isStep: true, cleaned: newRuns }
    }
  }

  return { isStep: false, cleaned: content }
}
