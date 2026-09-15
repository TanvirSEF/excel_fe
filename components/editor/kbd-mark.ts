import { Mark } from "@tiptap/core"

export const KbdMark = Mark.create({
  name: "kbd",
  parseHTML() {
    return [{ tag: "kbd" }]
  },
  renderHTML() {
    return ["kbd", {}, 0]
  },
})
