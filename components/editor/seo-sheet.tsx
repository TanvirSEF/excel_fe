"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  SeoFields,
  type SeoFormFields,
} from "@/components/editor/seo-fields"
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
}): SeoFormFields {
  return {
    metaTitle: post.meta_title ?? "",
    metaDescription: post.meta_description ?? "",
    canonicalUrl: post.canonical_url ?? "",
    ogImageUrl: post.og_image_url ?? "",
  }
}

function SeoSheetForm({
  postId,
  onDone,
}: {
  postId: string
  onDone: () => void
}) {
  const { data: post, isPending } = usePost(postId)
  const updateSeo = useUpdateSeo(postId)
  const [edited, setEdited] = useState<SeoFormFields | null>(null)

  const values =
    edited ??
    (post
      ? seoFromPost({
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          canonical_url: post.canonical_url,
          og_image_url: post.og_image_url,
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
      })
      toast.success("SEO saved.")
      onDone()
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
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
        {isPending || !values ? (
          <div className="space-y-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-24" />
            <Skeleton className="h-10" />
          </div>
        ) : (
          <>
            <SeoFields
              fields={values}
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
