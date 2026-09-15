import { Extension } from "@tiptap/core"

export const HeadingNum = Extension.create({
  name: "headingNum",
  addGlobalAttributes() {
    return [
      {
        types: ["heading"],
        attributes: {
          num: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-numhead"),
            renderHTML: (attributes) =>
              attributes.num ? { "data-numhead": attributes.num } : {},
          },
        },
      },
    ]
  },
})
