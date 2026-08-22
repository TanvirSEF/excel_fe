"use client"

import { useState } from "react"
import slugify from "slugify"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ApiClientError } from "@/lib/api/error"
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/lib/queries/categories"
import type { Category } from "@/types/api"

interface CategorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  categories: Category[]
}

interface FormState {
  name: string
  slug: string
  autoSlug: boolean
  parentId: string
  description: string
  iconUrl: string
  colorHex: string
  isFeatured: boolean
  seoTitle: string
  seoDescription: string
}

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  autoSlug: true,
  parentId: "",
  description: "",
  iconUrl: "",
  colorHex: "",
  isFeatured: false,
  seoTitle: "",
  seoDescription: "",
}

export function CategorySheet({
  open,
  onOpenChange,
  category,
  categories,
}: CategorySheetProps) {
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [loadedFor, setLoadedFor] = useState<string | null | undefined>(
    undefined
  )
  const [pending, setPending] = useState(false)

  const targetKey = category?.id ?? null
  if (open && loadedFor !== targetKey) {
    setLoadedFor(targetKey)
    setForm(
      category
        ? {
            name: category.name,
            slug: category.slug,
            autoSlug: false,
            parentId: category.parent_id ?? "",
            description: category.description ?? "",
            iconUrl: category.icon_url ?? "",
            colorHex: category.color_hex ?? "",
            isFeatured: category.is_featured,
            seoTitle: category.seo_title ?? "",
            seoDescription: category.seo_description ?? "",
          }
        : EMPTY_FORM
    )
  }

  const parentOptions = categories.filter(
    (candidate) => !candidate.parent_id && candidate.id !== category?.id
  )

  function patch(next: Partial<FormState>) {
    setForm((current) => ({ ...current, ...next }))
  }

  function onNameChange(name: string) {
    patch(
      form.autoSlug
        ? {
            name,
            slug: slugify(name, { lower: true, strict: true, trim: true }),
          }
        : { name }
    )
  }

  async function onSave() {
    if (!form.name.trim()) {
      toast.error("Name is required.")
      return
    }
    setPending(true)
    try {
      const input = {
        name: form.name.trim(),
        slug: form.slug || undefined,
        parent_id: form.parentId || null,
        description: form.description || null,
        icon_url: form.iconUrl || null,
        color_hex: form.colorHex || null,
        is_featured: form.isFeatured,
        seo_title: form.seoTitle || null,
        seo_description: form.seoDescription || null,
      }
      if (category) {
        await updateCategory.mutateAsync({
          categoryId: category.id,
          input,
        })
        toast.success("Category updated.")
      } else {
        await createCategory.mutateAsync(input)
        toast.success("Category created.")
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not save. Please try again."
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {category ? "Edit category" : "New category"}
          </SheetTitle>
          <SheetDescription>
            Categories organise the blog into two levels.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6">
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={form.name}
              onChange={(event) => onNameChange(event.target.value)}
              maxLength={100}
              placeholder="e.g. Formulas"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category-slug">Slug</Label>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.autoSlug}
                  onChange={(event) =>
                    patch(
                      event.target.checked
                        ? {
                            autoSlug: true,
                            slug: slugify(form.name, {
                              lower: true,
                              strict: true,
                              trim: true,
                            }),
                          }
                        : { autoSlug: false }
                    )
                  }
                />
                Auto from name
              </label>
            </div>
            <Input
              id="category-slug"
              value={form.slug}
              disabled={form.autoSlug}
              onChange={(event) => patch({ slug: event.target.value })}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-parent">Parent</Label>
            <select
              id="category-parent"
              value={form.parentId}
              onChange={(event) => patch({ parentId: event.target.value })}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="">Top level</option>
              {parentOptions.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <textarea
              id="category-description"
              value={form.description}
              onChange={(event) => patch({ description: event.target.value })}
              rows={2}
              placeholder="Shown on the category page"
              className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="category-color">Colour</Label>
              <div className="flex gap-2">
                <input
                  id="category-color"
                  type="color"
                  value={form.colorHex || "#6366f1"}
                  onChange={(event) => patch({ colorHex: event.target.value })}
                  className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-background"
                  aria-label="Pick colour"
                />
                <Input
                  value={form.colorHex}
                  onChange={(event) => patch({ colorHex: event.target.value })}
                  placeholder="#RRGGBB"
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-icon">Icon URL</Label>
              <Input
                id="category-icon"
                value={form.iconUrl}
                onChange={(event) => patch({ iconUrl: event.target.value })}
                placeholder="https://…"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) =>
                patch({ isFeatured: event.target.checked })
              }
              className="size-4 accent-primary"
            />
            Featured on the home page
          </label>

          <div className="space-y-4 border-t pt-4">
            <p className="text-sm font-medium">SEO</p>
            <div className="space-y-2">
              <Label htmlFor="category-seo-title">SEO title</Label>
              <Input
                id="category-seo-title"
                value={form.seoTitle}
                onChange={(event) => patch({ seoTitle: event.target.value })}
                placeholder="Defaults to the name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-seo-description">SEO description</Label>
              <textarea
                id="category-seo-description"
                value={form.seoDescription}
                onChange={(event) =>
                  patch({ seoDescription: event.target.value })
                }
                rows={2}
                className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={onSave} disabled={pending}>
              {pending ? "Saving…" : category ? "Save changes" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
