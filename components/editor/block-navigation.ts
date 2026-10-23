import { Extension } from "@tiptap/core"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"

export const BlockNavigation = Extension.create({
  name: "blockNavigation",

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor
        const { selection } = state

        if (selection instanceof NodeSelection) {
          const afterPos = selection.to
          const paraType = state.schema.nodes.paragraph
          if (!paraType) return false
          const newPara = paraType.createAndFill()
          if (!newPara) return false
          const tr = state.tr.insert(afterPos, newPara)
          tr.setSelection(TextSelection.create(tr.doc, afterPos + 1))
          editor.view.dispatch(tr)
          editor.view.focus()
          return true
        }

        if (selection.empty) {
          const { $from } = selection

          if ($from.parent.type.name === "heading" && $from.parentOffset === 0) {
            const beforePos = $from.before()
            const paraType = state.schema.nodes.paragraph
            if (!paraType) return false
            const newPara = paraType.createAndFill()
            if (!newPara) return false
            const tr = state.tr.insert(beforePos, newPara)
            tr.setSelection(TextSelection.create(tr.doc, beforePos + 1))
            editor.view.dispatch(tr)
            editor.view.focus()
            return true
          }

          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth)
            if (node.type.name === "callout" || node.type.name === "accordion") {
              const currentBlock = $from.parent
              if (
                currentBlock.type.name === "paragraph" &&
                currentBlock.content.size === 0
              ) {
                const indexInContainer = $from.index(depth)
                const isLast = indexInContainer === node.childCount - 1
                if (isLast) {
                  const paraType = state.schema.nodes.paragraph
                  if (!paraType) return false
                  const newPara = paraType.createAndFill()
                  if (!newPara) return false

                  const tr = state.tr
                  if (node.childCount > 1) {
                    const pBefore = $from.before(depth + 1)
                    const pAfter = $from.after(depth + 1)
                    tr.delete(pBefore, pAfter)
                    const afterContainer = tr.mapping.map($from.after(depth))
                    tr.insert(afterContainer, newPara)
                    tr.setSelection(
                      TextSelection.create(tr.doc, afterContainer + 1)
                    )
                  } else {
                    const afterContainer = $from.after(depth)
                    tr.insert(afterContainer, newPara)
                    tr.setSelection(
                      TextSelection.create(tr.doc, afterContainer + 1)
                    )
                  }
                  editor.view.dispatch(tr)
                  editor.view.focus()
                  return true
                }
              }
              break
            }
          }
        }

        return false
      },

      "Shift-Enter": ({ editor }) => {
        const { state } = editor
        const { selection } = state

        if (selection instanceof NodeSelection) {
          const beforePos = selection.from
          const paraType = state.schema.nodes.paragraph
          if (!paraType) return false
          const newPara = paraType.createAndFill()
          if (!newPara) return false
          const tr = state.tr.insert(beforePos, newPara)
          tr.setSelection(TextSelection.create(tr.doc, beforePos + 1))
          editor.view.dispatch(tr)
          editor.view.focus()
          return true
        }

        if (
          selection.empty &&
          selection.$from.parent.type.name === "heading" &&
          selection.$from.parentOffset === 0
        ) {
          const beforePos = selection.$from.before()
          const paraType = state.schema.nodes.paragraph
          if (!paraType) return false
          const newPara = paraType.createAndFill()
          if (!newPara) return false
          const tr = state.tr.insert(beforePos, newPara)
          tr.setSelection(TextSelection.create(tr.doc, beforePos + 1))
          editor.view.dispatch(tr)
          editor.view.focus()
          return true
        }

        return false
      },

      "Mod-Enter": ({ editor }) => {
        const { state } = editor
        const { selection } = state
        const paraType = state.schema.nodes.paragraph
        if (!paraType) return false
        const newPara = paraType.createAndFill()
        if (!newPara) return false

        if (selection instanceof NodeSelection) {
          const afterPos = selection.to
          const tr = state.tr.insert(afterPos, newPara)
          tr.setSelection(TextSelection.create(tr.doc, afterPos + 1))
          editor.view.dispatch(tr)
          editor.view.focus()
          return true
        }

        const { $from } = selection

        for (let depth = $from.depth; depth > 0; depth--) {
          const node = $from.node(depth)
          if (node.type.name === "callout" || node.type.name === "accordion") {
            const afterPos = $from.after(depth)
            const tr = state.tr.insert(afterPos, newPara)
            tr.setSelection(TextSelection.create(tr.doc, afterPos + 1))
            editor.view.dispatch(tr)
            editor.view.focus()
            return true
          }
        }

        if ($from.depth >= 1) {
          const afterPos = $from.after(1)
          const tr = state.tr.insert(afterPos, newPara)
          tr.setSelection(TextSelection.create(tr.doc, afterPos + 1))
          editor.view.dispatch(tr)
          editor.view.focus()
          return true
        }

        return false
      },

      "Shift-Mod-Enter": ({ editor }) => {
        const { state } = editor
        const { selection } = state
        const paraType = state.schema.nodes.paragraph
        if (!paraType) return false
        const newPara = paraType.createAndFill()
        if (!newPara) return false

        if (selection instanceof NodeSelection) {
          const beforePos = selection.from
          const tr = state.tr.insert(beforePos, newPara)
          tr.setSelection(TextSelection.create(tr.doc, beforePos + 1))
          editor.view.dispatch(tr)
          editor.view.focus()
          return true
        }

        const { $from } = selection

        for (let depth = $from.depth; depth > 0; depth--) {
          const node = $from.node(depth)
          if (node.type.name === "callout" || node.type.name === "accordion") {
            const beforePos = $from.before(depth)
            const tr = state.tr.insert(beforePos, newPara)
            tr.setSelection(TextSelection.create(tr.doc, beforePos + 1))
            editor.view.dispatch(tr)
            editor.view.focus()
            return true
          }
        }

        if ($from.depth >= 1) {
          const beforePos = $from.before(1)
          const tr = state.tr.insert(beforePos, newPara)
          tr.setSelection(TextSelection.create(tr.doc, beforePos + 1))
          editor.view.dispatch(tr)
          editor.view.focus()
          return true
        }

        return false
      },
    }
  },
})
