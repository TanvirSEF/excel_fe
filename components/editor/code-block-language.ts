import CodeBlock from "@tiptap/extension-code-block"

export const CodeBlockLanguage = CodeBlock.extend({
  addAttributes() {
    return {
      language: {
        default: "plaintext",
        parseHTML: (element) =>
          element.getAttribute("data-language") ?? "plaintext",
        renderHTML: (attributes) => ({
          "data-language": attributes.language,
        }),
      },
    }
  },
})
