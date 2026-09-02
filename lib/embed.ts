const YOUTUBE_PATTERNS = [
  /youtu\.be\/([\w-]{6,})/,
  /youtube\.com\/watch\?v=([\w-]{6,})/,
  /youtube\.com\/shorts\/([\w-]{6,})/,
  /youtube\.com\/embed\/([\w-]{6,})/,
]

export function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("youtube.com") || parsed.hostname === "youtu.be") {
      for (const pattern of YOUTUBE_PATTERNS) {
        const match = url.match(pattern)
        if (match?.[1]) return `https://www.youtube-nocookie.com/embed/${match[1]}`
      }
      return null
    }
    if (parsed.hostname === "vimeo.com" || parsed.hostname === "player.vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop()
      return id && /^\d+$/.test(id)
        ? `https://player.vimeo.com/video/${id}`
        : null
    }
    return null
  } catch {
    return null
  }
}
