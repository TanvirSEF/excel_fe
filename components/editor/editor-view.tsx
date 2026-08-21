"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import type { JSONContent } from "@tiptap/react"
import { toast } from "sonner"

import { PostStatusBadge } from "@/components/dashboard/post-status-badge"
import { PostEditor } from "@/components/editor/post-editor"
import {
  PostForm,
  type PostFormFields,
} from "@/components/editor/post-form"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiClientError } from "@/lib/api/error"
import { blocksToDoc, docToBlocks } from "@/lib/editor-serialize"
import {
  useCreatePost,
  usePost,
  useUpdatePost,
} from "@/lib/queries/posts"
import { useTags as useAllTags } from "@/lib/queries/categories"

const EMPTY_FIELDS: PostFormFields = {
  title: "",
  slug: "",
  autoSlug: true,
  excerpt: "",
  categoryId: "",
  tags: [],
  featuredImageUrl: "",
}

interface EditorViewProps {
  postId?: string
}

export function EditorView({ postId }: EditorViewProps) {
  const router = useRouter()
  const { data: post, isPending } = usePost(postId)
  const { data: allTags } = useAllTags()
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()

  const [fields, setFields] = useState<PostFormFields>(EMPTY_FIELDS)
  const [doc, setDoc] = useState<JSONContent | null>(null)
  const [initialDoc, setInitialDoc] = useState<JSONContent | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const dirtyRef = useRef(false)
  const savingRef = useRef(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (!postId || !post || initialized.current) return
    initialized.current = true
    const initialDoc = blocksToDoc(post.content_json?.blocks ?? [])
    setInitialDoc(initialDoc)
    setDoc(initialDoc)
    setFields({
      title: post.title,
      slug: post.slug,
      autoSlug: false,
      excerpt: post.excerpt ?? "",
      categoryId: post.category_id ?? "",
      tags: post.tags,
      featuredImageUrl: post.featured_image_url ?? "",
    })
  }, [postId, post])

  const markDirty = useCallback(() => {
    dirtyRef.current = true
    setDirty(true)
  }, [])

  const onDocChange = useCallback(
    (nextDoc: JSONContent) => {
      setDoc(nextDoc)
      markDirty()
    },
    [markDirty]
  )

  const onFieldsChange = useCallback(
    (patch: Partial<PostFormFields>) => {
      setFields((current) => ({ ...current, ...patch }))
      markDirty()
    },
    [markDirty]
  )

  const save = useCallback(
    async (options: { silent?: boolean } = {}) => {
      if (savingRef.current) return
      if (!fields.title.trim()) {
        if (!options.silent) toast.error("Title is required.")
        return
      }

      setSaving(true)
      savingRef.current = true
      try {
        const input = {
          title: fields.title.trim(),
          slug: fields.slug || undefined,
          excerpt: fields.excerpt || undefined,
          content_json: { blocks: docToBlocks(doc) },
          featured_image_url: fields.featuredImageUrl || null,
          category_id: fields.categoryId || null,
          tags: fields.tags,
        }

        if (postId) {
          await updatePost.mutateAsync({ postId, input })
          if (!options.silent) toast.success("Post saved.")
        } else {
          const created = await createPost.mutateAsync(input)
          if (!options.silent) toast.success("Draft created.")
          dirtyRef.current = false
          router.replace(`/dashboard/posts/${created.id}`)
          return
        }

        dirtyRef.current = false
        setDirty(false)
        setSlugError(null)
        setLastSavedAt(new Date())
      } catch (error) {
        if (error instanceof ApiClientError) {
          if (error.code === "SLUG_TAKEN") {
            setSlugError("This slug is already taken.")
            if (!options.silent)
              toast.error("Slug already taken — choose another one.")
          } else if (!options.silent) {
            toast.error(error.message)
          }
        } else if (!options.silent) {
          toast.error("Could not save. Please try again.")
        }
      } finally {
        setSaving(false)
        savingRef.current = false
      }
    },
    [
      createPost,
      doc,
      fields,
      postId,
      router,
      updatePost,
    ]
  )

  useEffect(() => {
    if (!postId) return
    const interval = setInterval(() => {
      if (dirtyRef.current && !savingRef.current) {
        save({ silent: true })
      }
    }, 30_000)
    return () => clearInterval(interval)
  }, [postId, save])

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (dirtyRef.current) {
        event.preventDefault()
        event.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [])

  if (postId && isPending) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          {postId && post ? (
            <PostStatusBadge
              status={post.status}
              rejectionReason={post.rejection_reason}
            />
          ) : (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              New draft
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {saving
              ? "Saving…"
              : dirty
                ? "Unsaved changes"
                : lastSavedAt
                  ? `Saved ${lastSavedAt.toLocaleTimeString()}`
                  : ""}
          </span>
        </div>
        <Button type="button" onClick={() => save()} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>

      {postId && post?.status === "rejected" && post.rejection_reason ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <p className="font-medium text-destructive">Rejected</p>
          <p className="mt-1 text-muted-foreground">
            {post.rejection_reason}
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <PostEditor initialDoc={initialDoc} onDocChange={onDocChange} />

        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-4">
            <p className="mb-4 text-sm font-semibold">Post</p>
            <PostForm
              fields={fields}
              slugError={slugError}
              onChange={onFieldsChange}
              existingTags={(allTags ?? []).map((tag) => tag.name)}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
