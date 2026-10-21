"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  IconArticle,
  IconArrowUp,
  IconCalculator,
  IconChevronRight,
  IconRefresh,
  IconThumbDown,
  IconThumbUp,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { API_BASE_PATH, config } from "@/lib/config"
import { cn } from "@/lib/utils"
import { AssistantAvatar } from "./assistant-avatar"
import { MessageRenderer } from "./message-renderer"

interface RecommendedArticle {
  title: string
  url: string
  excerpt?: string
}

interface RecommendedCalculator {
  name: string
  url: string
  hub: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  queryId?: string
  rating?: "up" | "down"
  articles?: RecommendedArticle[]
  calculators?: RecommendedCalculator[]
}

const QUICK_PROMPTS = [
  "How to use XLOOKUP with multiple criteria?",
  "How do I fix a #N/A formula error?",
  "Calculate Retail Profit Margin & Markup",
  "Compare two columns and find duplicates",
]

function generateMessageId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

export function ChatWidget() {
  const STORAGE_KEY = "excel_insider_cellie_chat_v1"
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const streamAccumulatorRef = useRef("")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Load persisted chat on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => {
            setMessages(parsed)
          }, 0)
        }
      }
    } catch {}
  }, [])

  // Auto-save messages to localStorage (capped at 20)
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)))
      } catch {}
    }
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, messages, isGenerating])

  const handleFeedback = async (messageId: string, rating: "up" | "down") => {
    const target = messages.find((m) => m.id === messageId)
    if (!target || target.rating === rating) return

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, rating } : m))
    )

    if (target.queryId) {
      try {
        await fetch(`${config.publicApiUrl}${API_BASE_PATH}/assistant/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query_id: target.queryId,
            rating,
          }),
        })
      } catch {}
    }
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim()
    if (!text || isGenerating) return

    const userMessage: ChatMessage = {
      id: generateMessageId("user"),
      role: "user",
      content: text,
    }

    const assistantMessageId = generateMessageId("assistant")
    const placeholderAssistant: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    }

    streamAccumulatorRef.current = ""
    setMessages((prev) => [...prev, userMessage, placeholderAssistant])
    setInput("")
    setIsGenerating(true)

    const payloadMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const endpoint = `${config.publicApiUrl}${API_BASE_PATH}/assistant/chat`
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      })

      if (!response.ok || !response.body) {
        throw new Error("Assistant response failed")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let metaArticles: RecommendedArticle[] = []
      let metaCalculators: RecommendedCalculator[] = []
      let receivedQueryId: string | undefined = undefined

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim()
            if (!jsonStr) continue
            try {
              const data = JSON.parse(jsonStr)

              if (data.type === "token" && data.text) {
                streamAccumulatorRef.current += data.text
                const currentText = streamAccumulatorRef.current
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: currentText }
                      : m
                  )
                )
              } else if (data.type === "done") {
                if (data.articles) metaArticles = data.articles
                if (data.calculators) metaCalculators = data.calculators
                if (data.query_id) receivedQueryId = data.query_id
              } else if (data.error) {
                streamAccumulatorRef.current = data.error
                const errText = streamAccumulatorRef.current
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: errText }
                      : m
                  )
                )
              }
            } catch {
              // Ignore partial JSON parse chunks
            }
          }
        }
      }

      const finalContent = streamAccumulatorRef.current
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content: finalContent,
                queryId: receivedQueryId,
                articles: metaArticles.length > 0 ? metaArticles : undefined,
                calculators:
                  metaCalculators.length > 0 ? metaCalculators : undefined,
              }
            : m
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content:
                  "Could not connect to the assistant. Please check your internet connection and try again.",
              }
            : m
        )
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setInput("")
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  return (
    <div className="fixed bottom-26 sm:bottom-28 right-4 sm:right-6 z-[2147483647] flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end">
        {/* Floating Mascot & Trigger */}
        {!isOpen ? (
          <div className="group relative flex items-center gap-2 select-none">
            {/* Friendly Speech Bubble / Prompt Pill */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/95 px-3.5 py-2 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-x-0.5 cursor-pointer"
              aria-label="Open Cellie Assistant"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <div className="flex flex-col text-left pr-0.5">
                <span className="text-xs font-bold leading-tight text-foreground">
                  Need Excel help?
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  Ask Cellie &bull; Formulas &amp; Guides
                </span>
              </div>
            </button>

            {/* Completely Free Floating Mascot Character */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open Cellie Assistant"
              className="relative flex items-center justify-center transition-transform duration-300 hover:scale-115 active:scale-95 cursor-pointer focus:outline-none"
            >
              <AssistantAvatar className="h-14 w-14 sm:h-16 sm:w-16 drop-shadow-lg" />
            </button>
          </div>
        ) : null}

        {/* Modern Chat Window Panel */}
        {isOpen ? (
          <div className="flex flex-col w-[410px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-140px)] rounded-2xl border border-border/90 bg-card shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <AssistantAvatar className="h-10 w-10 drop-shadow-sm" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-foreground leading-tight">
                    Cellie
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Online
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Spreadsheet &amp; formula assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 ? (
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <IconRefresh className="h-4 w-4" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:thin]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-4 px-2 space-y-3.5">
                <AssistantAvatar className="h-16 w-16 drop-shadow-md" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Hi! I&apos;m Cellie. How can I help today?
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                    Ask how to build any formula, troubleshoot errors like #N/A or #VALUE!, or explore Excel tutorials.
                  </p>
                </div>

                <div className="w-full space-y-2 pt-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Frequently Asked Questions
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left rounded-xl border border-border/80 bg-background/80 px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-muted/60 transition-colors shadow-2xs cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col",
                  m.role === "user" ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground font-medium rounded-br-xs shadow-xs"
                      : "bg-muted/50 text-foreground border border-border/70 rounded-bl-xs shadow-xs"
                  )}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <>
                      {m.content ? (
                        <MessageRenderer content={m.content} />
                      ) : (
                        <div className="flex items-center gap-1.5 py-1 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" />
                          <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:0.2s]" />
                          <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Recommended Articles & Calculators Cards */}
                {m.articles && m.articles.length > 0 ? (
                  <div className="mt-2.5 w-full max-w-[90%] space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <IconArticle className="h-3.5 w-3.5 text-primary" />
                      <span>Recommended Tutorials</span>
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {m.articles.map((art) => (
                        <Link
                          key={art.url}
                          href={art.url}
                          prefetch={false}
                          className="group flex items-center justify-between rounded-xl border border-border/80 bg-background/80 p-2 text-xs hover:border-primary/60 hover:bg-muted/50 transition-colors shadow-2xs"
                        >
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate pr-2">
                            {art.title}
                          </span>
                          <IconChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {m.calculators && m.calculators.length > 0 ? (
                  <div className="mt-2 w-full max-w-[90%] space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <IconCalculator className="h-3.5 w-3.5 text-primary" />
                      <span>Related Free Calculators</span>
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {m.calculators.map((calc) => (
                        <Link
                          key={calc.url}
                          href={calc.url}
                          prefetch={false}
                          className="group flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-2 text-xs hover:border-primary/50 transition-colors shadow-2xs"
                        >
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate pr-2">
                            {calc.name} ({calc.hub})
                          </span>
                          <IconChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Feedback Toolbar for Assistant Messages */}
                {m.role === "assistant" && m.content && !isGenerating ? (
                  <div className="mt-1.5 flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground select-none">
                    <span className="text-[10px] text-muted-foreground/75">Was this helpful?</span>
                    <button
                      type="button"
                      onClick={() => handleFeedback(m.id, "up")}
                      title="Helpful"
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted cursor-pointer",
                        m.rating === "up"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <IconThumbUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeedback(m.id, "down")}
                      title="Not helpful"
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted cursor-pointer",
                        m.rating === "down"
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <IconThumbDown className="h-3.5 w-3.5" />
                    </button>
                    {m.rating ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
                        Thanks!
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Clean Input Area - Zero Model Mentions */}
          <div className="border-t border-border/80 p-3 bg-muted/20">
            <div className="relative flex items-center gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a formula, error, or workbook..."
                rows={1}
                disabled={isGenerating}
                className="flex-1 max-h-24 resize-none rounded-xl border border-input bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isGenerating}
                className="h-8.5 w-8.5 shrink-0 rounded-xl cursor-pointer"
                aria-label="Send message"
              >
                <IconArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  )
}
