const NARROW_CHARS = new Set("ijlt.,:;!|'`()[]{}/\\ -—")
const WIDE_CHARS = new Set("mwMW@")

function charWidth(char: string): number {
  if (NARROW_CHARS.has(char)) return 4
  if (WIDE_CHARS.has(char)) return 15
  if (char >= "A" && char <= "Z") return 10
  if (char >= "0" && char <= "9") return 9
  return 8
}

export function pixelWidth(text: string): number {
  let width = 0
  for (const char of text) width += charWidth(char)
  return width
}

export const TITLE_PIXEL_LIMIT = 580
export const DESCRIPTION_PIXEL_LIMIT = 920

export type PixelFit = "empty" | "ok" | "warn" | "over"

export function pixelFit(
  text: string,
  limit: number
): { fit: PixelFit; width: number } {
  const width = pixelWidth(text)
  if (width === 0) return { fit: "empty", width }
  if (width <= limit) return { fit: "ok", width }
  if (width <= Math.round(limit * 1.15)) return { fit: "warn", width }
  return { fit: "over", width }
}
