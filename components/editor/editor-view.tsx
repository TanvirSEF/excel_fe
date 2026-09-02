"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import type { JSONContent } from "@tiptap/react"
import { toast } from "sonner"

import { PostStatusBadge } from "@/components/dashboard/post-status-badge"
import { AssetsTab } from "@/components/editor/assets-tab"
import { PostEditor } from "@/components/editor/post-editor"
import {
  PostForm,
  type PostFormFields,
} from "@/components/editor/post-form"
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
  useUpdatePost,
  useUpdateSeo,
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
  isTrending: false,
}

const EMPTY_SEO: SeoFormFields = {
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  ogImageUrl: "",
}

const DEFAULT_SCHEMA_TYPE = "TechArticle"

interface EditorViewProps {
  postId?: string
}

export function EditorView({ postId }: EditorViewProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const { data: post, isPending } = usePost(postId)
  const { data: allTags } = useAllTags()
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const updateSeo = useUpdateSeo(postId ?? "")

  const [fields, setFields] = useState<PostFormFields>(EMPTY_FIELDS)
  const [seo, setSeo] = useState<SeoFormFields>(EMPTY_SEO)
  const [keyphrase, setKeyphrase] = useState("")
  const [schemaType, setSchemaType] = useState(DEFAULT_SCHEMA_TYPE)
  const [doc, setDoc] = useState<JSONContent | null>(null)
  const [initialDoc, setInitialDoc] = useState<JSONContent | null>(null)
  const [dirty, setDirty] = useState(false)
  const [seoDirty, setSeoDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [seoSaving, setSeoSaving] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const dirtyRef = useRef(false)
  const seoDirtyRef = useRef(false)
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
          tags: fields.tags,
          is_trending: fields.isTrending,
          focus_keyphrase: keyphrase.trim() || null,
        }

        if (postId) {
          await updatePost.mutateAsync({ postId, input })
          if (!options.silent) toast.success("Post saved.")
        } else {
          const created = await createPost.mutateAsync(input)
          if (!options.silent) toast.success("Draft created.")
          dirtyRef.current = false
          router.replace(`/dashboard/posts/${created.id}`)
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
      createPost,
      doc,
      fields,
      keyphrase,
      postId,
      router,
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
      if (schemaType !== (post?.schema_type || DEFAULT_SCHEMA_TYPE)) {
        await updatePost.mutateAsync({
          postId,
          input: { schema_type: schemaType },
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
  }, [postId, seoSaving, seo, schemaType, post, updateSeo, updatePost])

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

  if (postId && isPending) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  const canPublish = can(user, "posts:publish")
  const canEditSeo = can(user, "seo:edit")
  const isOwner = Boolean(postId && post && user && post.author_id === user.id)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
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

        <aside>
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
              />
            </div>
          )}

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
        </aside>
      </div>
    </div>
  )
}
