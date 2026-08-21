"use client"

import slugify from "slugify"

import { TagInput } from "@/components/editor/tag-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCategories } from "@/lib/queries/categories"
import type { Category } from "@/types/api"

export interface PostFormFields {
  title: string
  slug: string
  autoSlug: boolean
  excerpt: string
  categoryId: string
  tags: string[]
  featuredImageUrl: string
}

interface PostFormProps {
  fields: PostFormFields
  slugError?: string | null
  onChange: (patch: Partial<PostFormFields>) => void
  existingTags: string[]
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

function flatten(
  categories: Category[],
  depth = 0
): { category: Category; depth: number }[] {
  return categories.flatMap((category) => [
    { category, depth },
    ...flatten(category.children ?? [], depth + 1),
  ])
}

export function PostForm({
  fields,
  slugError,
  onChange,
  existingTags,
}: PostFormProps) {
  const { data: categories } = useCategories()

  const onTitleChange = (title: string) => {
    onChange(
      fields.autoSlug
        ? {
            title,
            slug: slugify(title, { lower: true, strict: true, trim: true }),
          }
        : { title }
    )
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="post-title">Title</Label>
        <Input
          id="post-title"
          value={fields.title}
          onChange={(event) => onTitleChange(event.target.value)}
          maxLength={255}
          placeholder="Article title"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="post-slug">Slug</Label>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={fields.autoSlug}
              onChange={(event) => {
                const autoSlug = event.target.checked
                onChange(
                  autoSlug
                    ? {
                        autoSlug,
                        slug: slugify(fields.title, {
                          lower: true,
                          strict: true,
                          trim: true,
                        }),
                      }
                    : { autoSlug }
                )
              }}
            />
            Auto from title
          </label>
        </div>
        <Input
          id="post-slug"
          value={fields.slug}
          disabled={fields.autoSlug}
          onChange={(event) => onChange({ slug: event.target.value })}
          placeholder="url-friendly-slug"
          className="font-mono text-sm"
        />
        {slugError ? (
          <p className="text-xs text-destructive">{slugError}</p>
        ) : (
          fields.slug &&
          !SLUG_PATTERN.test(fields.slug) && (
            <p className="text-xs text-destructive">
              Lowercase letters, numbers and single dashes only.
            </p>
          )
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="post-excerpt">Excerpt</Label>
          <span
            className={`text-xs ${fields.excerpt.length > 500 ? "text-destructive" : "text-muted-foreground"}`}
          >
            {fields.excerpt.length}/500
          </span>
        </div>
        <textarea
          id="post-excerpt"
          value={fields.excerpt}
          onChange={(event) => onChange({ excerpt: event.target.value })}
          rows={3}
          maxLength={500}
          placeholder="Short summary shown on cards and search results"
          className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="post-category">Category</Label>
        <select
          id="post-category"
          value={fields.categoryId}
          onChange={(event) => onChange({ categoryId: event.target.value })}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">No category</option>
          {(categories ?? []).length > 0
            ? flatten(categories ?? []).map(({ category, depth }) => (
                <option key={category.id} value={category.id}>
                  {depth > 0
                    ? `${"— ".repeat(depth)}${category.name}`
                    : category.name}
                </option>
              ))
            : null}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput
          value={fields.tags}
          suggestions={existingTags}
          onChange={(tags) => onChange({ tags })}
        />
        <p className="text-xs text-muted-foreground">
          New tags are created on save.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="post-image">Featured image URL</Label>
        <Input
          id="post-image"
          value={fields.featuredImageUrl}
          onChange={(event) =>
            onChange({ featuredImageUrl: event.target.value })
          }
          placeholder="https://…"
        />
      </div>
    </div>
  )
}
