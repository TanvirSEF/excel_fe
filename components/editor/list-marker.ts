import { Extension } from "@tiptap/core"

export const ListMarker = Extension.create({
  name: "listMarker",
  addGlobalAttributes() {
    return [
      {
        types: ["bulletList"],
        attributes: {
          marker: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-marker"),
            renderHTML: (attributes) =>
              attributes.marker ? { "data-marker": attributes.marker } : {},
          },
        },
      },
    ]
  },
})
