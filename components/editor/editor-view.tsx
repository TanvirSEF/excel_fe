"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import type { JSONContent } from "@tiptap/react"
import { toast } from "sonner"

import { IconEye, IconExternalLink } from "@tabler/icons-react"
import type { LivePreviewPayload } from "@/components/site/live-article-preview"
import type { Category } from "@/types/api"

import { PostStatusBadge } from "@/components/dashboard/post-status-badge"
import { AssetsTab } from "@/components/editor/assets-tab"
import { PostEditor } from "@/components/editor/post-editor"
import {
  PostForm,
  type PostFormFields,
} from "@/components/editor/post-form"
import { PostPreviewModal } from "@/components/editor/post-preview-modal"
import { SeoAnalysisPanel } from "@/components/editor/seo-analysis-panel"
import {
  SeoFields,
  type SeoFormFields,
} from "@/components/editor/seo-fields"
import { WorkflowActions } from "@/components/editor/workflow-actions"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiClientError } from "@/lib/api/error"
import { blocksToDoc, docToBlocks } from "@/lib/editor-serialize"
import { can, useAuthStore } from "@/lib/auth"
import {
  useCreatePost,
  usePost,
  useSetTrendingPin,
  useUpdatePost,
  useUpdateSeo,
} from "@/lib/queries/posts"
import { useAuthorOptions } from "@/lib/queries/users"
import { useCategories, useTags as useAllTags } from "@/lib/queries/categories"

const EMPTY_FIELDS: PostFormFields = {
  title: "",
  slug: "",
  autoSlug: true,
  excerpt: "",
  categoryId: "",
  authorId: "",
  tags: [],
  featuredImageUrl: "",
  isTrending: false,
}

const EMPTY_SEO: SeoFormFields = {
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  ogImageUrl: "",
}

const DEFAULT_SCHEMA_TYPE = "TechArticle"

function findCategory(
  categories: Category[] | undefined,
  id: string
): Category | undefined {
  if (!categories || !id) return undefined
  for (const cat of categories) {
    if (cat.id === id) return cat
    if (cat.children?.length) {
      const match = findCategory(cat.children, id)
      if (match) return match
    }
  }
  return undefined
}

interface EditorViewProps {
  postId?: string
}

export function EditorView({ postId }: EditorViewProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const canPublish = can(user, "posts:publish")
  const canChangeAuthor =
    can(user, "posts:publish") ||
    user?.role === "super_admin" ||
    user?.role === "senior_editor"

  const { data: post, isPending, isError, error, refetch } = usePost(postId)
  const { data: authors } = useAuthorOptions(Boolean(canChangeAuthor))
  const { data: categories } = useCategories()
  const { data: allTags } = useAllTags()
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const updateSeo = useUpdateSeo(postId ?? "")
  const setTrendingPin = useSetTrendingPin()

  const [fields, setFields] = useState<PostFormFields>(() => ({
    ...EMPTY_FIELDS,
    authorId: user?.id ?? "",
  }))
  const [seo, setSeo] = useState<SeoFormFields>(EMPTY_SEO)
  const [keyphrase, setKeyphrase] = useState("")
  const [schemaType, setSchemaType] = useState(DEFAULT_SCHEMA_TYPE)
  const [doc, setDoc] = useState<JSONContent | null>(null)
  const [initialDoc, setInitialDoc] = useState<JSONContent | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [seoDirty, setSeoDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [seoSaving, setSeoSaving] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const dirtyRef = useRef(false)
  const seoDirtyRef = useRef(false)
  const savingRef = useRef(false)
  const initializedPostId = useRef<string | null>(null)

  useEffect(() => {
    if (!postId || !post || initializedPostId.current === post.id) return
    initializedPostId.current = post.id
    const rawBlocks = Array.isArray(post.content_json)
      ? post.content_json
      : Array.isArray(post.content_json?.blocks)
        ? post.content_json.blocks
        : []
    const parsedDoc = blocksToDoc(rawBlocks)
    setInitialDoc(parsedDoc)
    setDoc(parsedDoc)
    setFields({
      title: post.title,
      slug: post.slug,
      autoSlug: false,
      excerpt: post.excerpt ?? "",
      categoryId: post.category_id ?? "",
      authorId: post.author_id ?? user?.id ?? "",
      tags: post.tags,
      featuredImageUrl: post.featured_image_url ?? "",
      isTrending: post.is_trending ?? false,
    })
    setSeo({
      metaTitle: post.meta_title ?? "",
      metaDescription: post.meta_description ?? "",
      canonicalUrl: post.canonical_url ?? "",
      ogImageUrl: post.og_image_url ?? "",
    })
    setKeyphrase(post.focus_keyphrase ?? "")
    setSchemaType(post.schema_type || DEFAULT_SCHEMA_TYPE)
  }, [postId, post, user?.id])

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

  const onSeoChange = useCallback((patch: Partial<SeoFormFields>) => {
    setSeo((current) => ({ ...current, ...patch }))
    seoDirtyRef.current = true
    setSeoDirty(true)
  }, [])

  const onKeyphraseChange = useCallback(
    (value: string) => {
      setKeyphrase(value)
      markDirty()
    },
    [markDirty]
  )

  const buildLivePreviewPayload = useCallback((): LivePreviewPayload => {
    const blocks = docToBlocks(doc)
    const selectedAuthor = fields.authorId
      ? authors?.find((a) => a.id === fields.authorId)
      : null
    const authorName = selectedAuthor?.name ?? user?.name ?? "Editorial Team"
    const authorAvatarUrl = selectedAuthor?.avatar_url ?? null
    const selectedCategory = findCategory(categories, fields.categoryId)

    return {
      title: fields.title,
      slug: fields.slug,
      excerpt: fields.excerpt,
      blocks,
      featuredImageUrl: fields.featuredImageUrl,
      isTrending: fields.isTrending,
      tags: fields.tags,
      authorId: fields.authorId,
      authorName,
      authorAvatarUrl,
      categoryId: fields.categoryId,
      categoryName: selectedCategory?.name ?? null,
      categorySlug: selectedCategory?.slug ?? null,
      originalPostId: postId,
      originalPostStatus: post?.status,
      updatedAt: new Date().toISOString(),
    }
  }, [authors, categories, doc, fields, post?.status, postId, user?.name])

  const openLivePreview = useCallback(() => {
    const payload = buildLivePreviewPayload()
    try {
      localStorage.setItem("ei_live_preview_post", JSON.stringify(payload))
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("ei_live_preview")
        channel.postMessage(payload)
        channel.close()
      }
    } catch {
      // ignore
    }
    window.open("/preview", "_blank")
  }, [buildLivePreviewPayload])

  useEffect(() => {
    if (!doc && !fields.title) return
    if (typeof BroadcastChannel === "undefined") return
    try {
      const payload = buildLivePreviewPayload()
      localStorage.setItem("ei_live_preview_post", JSON.stringify(payload))
      const channel = new BroadcastChannel("ei_live_preview")
      channel.postMessage(payload)
      channel.close()
    } catch {
      // ignore
    }
  }, [buildLivePreviewPayload, doc, fields])

  const onSchemaTypeChange = useCallback((value: string) => {
    setSchemaType(value)
    seoDirtyRef.current = true
    setSeoDirty(true)
  }, [])

  const save = useCallback(
    async (options: { silent?: boolean } = {}): Promise<boolean> => {
      if (savingRef.current) return true
      if (!fields.title.trim()) {
        if (!options.silent) toast.error("Title is required.")
        return false
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
          author_id: fields.authorId || undefined,
          tags: fields.tags,
          focus_keyphrase: keyphrase.trim() || null,
        }

        let targetPostId = postId
        if (targetPostId) {
          await updatePost.mutateAsync({ postId: targetPostId, input })
        } else {
          const created = await createPost.mutateAsync(input)
          targetPostId = created.id
        }

        if (canPublish && targetPostId) {
          const originalTrending = post?.is_trending ?? false
          if (postId ? fields.isTrending !== originalTrending : fields.isTrending) {
            try {
              await setTrendingPin.mutateAsync({
                postId: targetPostId,
                pinned: fields.isTrending,
              })
            } catch {
              // Non-blocking so the post itself stays successfully saved
            }
          }
        }

        if (postId) {
          if (!options.silent) toast.success("Post saved.")
        } else {
          if (!options.silent) toast.success("Draft created.")
          dirtyRef.current = false
          router.replace(`/dashboard/posts/${targetPostId}`)
          return true
        }

        dirtyRef.current = false
        setDirty(false)
        setSlugError(null)
        setLastSavedAt(new Date())
        return true
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
        return false
      } finally {
        setSaving(false)
        savingRef.current = false
      }
    },
    [
      canPublish,
      createPost,
      doc,
      fields,
      keyphrase,
      post,
      postId,
      router,
      setTrendingPin,
      updatePost,
    ]
  )

  const saveSeo = useCallback(async () => {
    if (!postId || seoSaving) return
    setSeoSaving(true)
    try {
      await updateSeo.mutateAsync({
        meta_title: seo.metaTitle || undefined,
        meta_description: seo.metaDescription || undefined,
        canonical_url: seo.canonicalUrl || null,
        og_image_url: seo.ogImageUrl || null,
      })
      const patchInput: Record<string, unknown> = {}
      if (schemaType !== (post?.schema_type || DEFAULT_SCHEMA_TYPE)) {
        patchInput.schema_type = schemaType
      }
      if (keyphrase.trim() !== (post?.focus_keyphrase || "")) {
        patchInput.focus_keyphrase = keyphrase.trim() || null
      }
      if (Object.keys(patchInput).length > 0) {
        await updatePost.mutateAsync({
          postId,
          input: patchInput,
        })
      }
      toast.success("SEO saved.")
      seoDirtyRef.current = false
      setSeoDirty(false)
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not save SEO. Please try again."
      )
    } finally {
      setSeoSaving(false)
    }
  }, [postId, seoSaving, seo, schemaType, keyphrase, post, updateSeo, updatePost])

  const saveBeforeAction = useCallback(async () => {
    if (!dirtyRef.current) return true
    return save({ silent: true })
  }, [save])

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
      if (dirtyRef.current || seoDirtyRef.current) {
        event.preventDefault()
        event.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [])

  if (postId && (isPending || !initialDoc)) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (postId && isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <h2 className="text-lg font-bold text-destructive">Could not load post</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {error instanceof ApiClientError
            ? error.message
            : "The requested post could not be found or failed to load."}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/posts">Back to posts</Link>
          </Button>
        </div>
      </div>
    )
  }

  const canEditSeo = can(user, "seo:edit")
  const isOwner = Boolean(postId && post && user && post.author_id === user.id)

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-30 -mx-4 -mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-background/95 px-4 py-3 shadow-2xs backdrop-blur-md md:-mt-6 lg:-mx-6 lg:px-6">
        <div className="flex flex-wrap items-center gap-3">
          {postId && post ? (
            <PostStatusBadge
              status={post.status}
              rejectionReason={post.rejection_reason}
              scheduledAt={post.scheduled_at}
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
          {postId && post ? (
            <WorkflowActions
              postId={postId}
              status={post.status}
              scheduledAt={post.scheduled_at}
              canPublish={canPublish}
              isOwner={isOwner}
              title={post.title}
              onBeforeAction={saveBeforeAction}
            />
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openLivePreview}
            title="Open real website preview in a new tab without saving"
          >
            <IconExternalLink className="mr-1.5 h-4 w-4" />
            View Live ↗
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
          >
            <IconEye className="mr-1.5 h-4 w-4" />
            Preview
          </Button>
          <Button type="button" onClick={() => save()} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
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
        <div className="space-y-6 min-w-0">
          <PostEditor
            key={postId ?? "new"}
            initialDoc={initialDoc}
            onDocChange={onDocChange}
          />

          <SeoAnalysisPanel
            title={fields.title}
            slug={fields.slug}
            excerpt={fields.excerpt}
            metaTitle={seo.metaTitle}
            metaDescription={seo.metaDescription}
            canonicalUrl={seo.canonicalUrl}
            keyphrase={keyphrase}
            doc={doc}
            onKeyphraseChange={onKeyphraseChange}
          />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-[3.75rem] lg:self-start lg:max-h-[calc(100vh-4.5rem)] lg:overflow-y-auto lg:pr-1">
          {postId ? (
            <Tabs defaultValue="post">
              <TabsList className="w-full">
                <TabsTrigger value="post" className="flex-1">
                  Post
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex-1">
                  SEO
                </TabsTrigger>
                <TabsTrigger value="assets" className="flex-1">
                  Assets
                </TabsTrigger>
              </TabsList>
              <TabsContent value="post" className="mt-4">
                <div className="rounded-xl border bg-card p-4">
                  <PostForm
                    fields={fields}
                    slugError={slugError}
                    onChange={onFieldsChange}
                    existingTags={(allTags ?? []).map((tag) => tag.name)}
                    authors={authors}
                    canChangeAuthor={canChangeAuthor}
                    canPin={canPublish}
                  />
                </div>
              </TabsContent>
              <TabsContent value="seo" className="mt-4">
                <div className="space-y-4 rounded-xl border bg-card p-4">
                  {canEditSeo ? null : (
                    <p className="text-xs text-muted-foreground">
                      Read-only — SEO fields are managed by editors.
                    </p>
                  )}
                  <SeoFields
                    fields={seo}
                    focusKeyphrase={keyphrase}
                    onFocusKeyphraseChange={onKeyphraseChange}
                    schemaType={schemaType}
                    onSchemaTypeChange={onSchemaTypeChange}
                    disabled={!canEditSeo}
                    onChange={onSeoChange}
                  />
                  {canEditSeo ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={saveSeo}
                      disabled={seoSaving || !seoDirty}
                    >
                      {seoSaving ? "Saving…" : "Save SEO"}
                    </Button>
                  ) : null}
                </div>
              </TabsContent>
              <TabsContent value="assets" className="mt-4">
                <div className="rounded-xl border bg-card p-4">
                  <AssetsTab postId={postId} />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="rounded-xl border bg-card p-4">
              <PostForm
                fields={fields}
                slugError={slugError}
                onChange={onFieldsChange}
                existingTags={(allTags ?? []).map((tag) => tag.name)}
                authors={authors}
                canChangeAuthor={canChangeAuthor}
                canPin={canPublish}
              />
            </div>
          )}
        </aside>
      </div>

      <PostPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        fields={fields}
        doc={doc}
        authors={authors}
        categories={categories}
        currentUserName={user?.name}
      />
    </div>
  )
}
