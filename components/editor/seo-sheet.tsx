"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  SeoFields,
  type SeoFormFields,
} from "@/components/editor/seo-fields"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiClientError } from "@/lib/api/error"
import { usePost, useUpdateSeo } from "@/lib/queries/posts"

interface SeoSheetProps {
  postId: string | null
  onOpenChange: (open: boolean) => void
}

export function SeoSheet({ postId, onOpenChange }: SeoSheetProps) {
  return (
    <Sheet open={postId !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {postId ? (
          <SeoSheetForm
            key={postId}
            postId={postId}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function seoFromPost(post: {
  meta_title: string | null
  meta_description: string | null
  canonical_url: string | null
  og_image_url: string | null
  excerpt?: string | null
  featured_image_url?: string | null
}): SeoFormFields {
  return {
    metaTitle: post.meta_title ?? "",
    metaDescription: post.meta_description ?? post.excerpt ?? "",
    canonicalUrl: post.canonical_url ?? "",
    ogImageUrl: post.og_image_url ?? post.featured_image_url ?? "",
  }
}

function SeoSheetForm({
  postId,
  onDone,
}: {
  postId: string
  onDone: () => void
}) {
  const { data: post, isPending, isError, error, refetch } = usePost(postId)
  const updateSeo = useUpdateSeo(postId)
  const [edited, setEdited] = useState<SeoFormFields | null>(null)
  const [keyphrase, setKeyphrase] = useState<string | null>(null)
  const [schemaType, setSchemaType] = useState<string | null>(null)

  const activeKeyphrase = keyphrase ?? post?.focus_keyphrase ?? ""
  const activeSchemaType = schemaType ?? post?.schema_type ?? "TechArticle"

  const values =
    edited ??
    (post
      ? seoFromPost({
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          excerpt: post.excerpt,
          canonical_url: post.canonical_url,
          og_image_url: post.og_image_url,
          featured_image_url: post.featured_image_url,
        })
      : null)

  async function onSave() {
    if (!values) return
    try {
      await updateSeo.mutateAsync({
        meta_title: values.metaTitle || undefined,
        meta_description: values.metaDescription || undefined,
        canonical_url: values.canonicalUrl || null,
        og_image_url: values.ogImageUrl || null,
        focus_keyphrase: activeKeyphrase.trim() || null,
        schema_type: activeSchemaType || undefined,
      })
      toast.success("SEO saved.")
      onDone()
    } catch (saveError) {
      toast.error(
        saveError instanceof ApiClientError
          ? saveError.message
          : "Could not save SEO. Please try again."
      )
    }
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="truncate">
          {post?.title ?? "SEO"}
        </SheetTitle>
        <SheetDescription>
          Search appearance for this published post.
        </SheetDescription>
      </SheetHeader>
      <div className="space-y-4 px-4 pb-6">
        {isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-24" />
            <Skeleton className="h-10" />
          </div>
        ) : isError ? (
          <ErrorState
            title="Could not load post"
            message={
              error instanceof ApiClientError
                ? error.message
                : "The post details could not be retrieved."
            }
            action={
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : !values ? (
          <div className="space-y-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-24" />
            <Skeleton className="h-10" />
          </div>
        ) : (
          <>
            <SeoFields
              fields={values}
              focusKeyphrase={activeKeyphrase}
              onFocusKeyphraseChange={setKeyphrase}
              schemaType={activeSchemaType}
              onSchemaTypeChange={setSchemaType}
              onChange={(patch) =>
                setEdited({ ...values, ...patch })
              }
            />
            <Button
              type="button"
              onClick={onSave}
              disabled={updateSeo.isPending}
            >
              {updateSeo.isPending ? "Saving…" : "Save SEO"}
            </Button>
          </>
        )}
      </div>
    </>
  )
}
