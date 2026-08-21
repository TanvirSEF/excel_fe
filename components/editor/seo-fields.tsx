"use client"

import { useState } from "react"

import { MediaPicker } from "@/components/editor/media-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  DESCRIPTION_PIXEL_LIMIT,
  TITLE_PIXEL_LIMIT,
  pixelFit,
} from "@/lib/seo-pixels"

export interface SeoFormFields {
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  ogImageUrl: string
}

const SCHEMA_TYPES = [
  "TechArticle",
  "Article",
  "BlogPosting",
  "NewsArticle",
  "HowTo",
]

const FIT_BAR_STYLES: Record<string, string> = {
  empty: "bg-muted",
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  over: "bg-destructive",
}

const FIT_HINTS: Record<string, string> = {
  empty: "",
  ok: "Fits search results",
  warn: "May truncate in Google",
  over: "Will truncate in Google",
}

function PixelHint({ text, limit }: { text: string; limit: number }) {
  const { fit, width } = pixelFit(text, limit)
  const pct = Math.min(100, Math.round((width / limit) * 100))

  return (
    <div className="space-y-1">
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all", FIT_BAR_STYLES[fit])}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        ≈{width}px / {limit}px — {FIT_HINTS[fit]}
      </p>
    </div>
  )
}

interface SeoFieldsProps {
  fields: SeoFormFields
  schemaType?: string
  onSchemaTypeChange?: (value: string) => void
  disabled?: boolean
  onChange: (patch: Partial<SeoFormFields>) => void
}

export function SeoFields({
  fields,
  schemaType,
  onSchemaTypeChange,
  disabled,
  onChange,
}: SeoFieldsProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="seo-meta-title">Meta title</Label>
          <span className="text-xs text-muted-foreground">
            {fields.metaTitle.length}/255
          </span>
        </div>
        <Input
          id="seo-meta-title"
          value={fields.metaTitle}
          disabled={disabled}
          onChange={(event) => onChange({ metaTitle: event.target.value })}
          maxLength={255}
          placeholder="Defaults to the post title"
        />
        <PixelHint text={fields.metaTitle} limit={TITLE_PIXEL_LIMIT} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="seo-meta-description">Meta description</Label>
          <span className="text-xs text-muted-foreground">
            {fields.metaDescription.length}/500
          </span>
        </div>
        <textarea
          id="seo-meta-description"
          value={fields.metaDescription}
          disabled={disabled}
          onChange={(event) =>
            onChange({ metaDescription: event.target.value })
          }
          rows={3}
          maxLength={500}
          placeholder="Defaults to the excerpt"
          className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <PixelHint
          text={fields.metaDescription}
          limit={DESCRIPTION_PIXEL_LIMIT}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-canonical">Canonical URL</Label>
        <Input
          id="seo-canonical"
          value={fields.canonicalUrl}
          disabled={disabled}
          onChange={(event) => onChange({ canonicalUrl: event.target.value })}
          placeholder="https://excelinsider.com/… (leave empty for default)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-og-image">OG image</Label>
        <div className="flex gap-2">
          <Input
            id="seo-og-image"
            value={fields.ogImageUrl}
            disabled={disabled}
            onChange={(event) => onChange({ ogImageUrl: event.target.value })}
            placeholder="https://… (leave empty to use featured image)"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={disabled}
            onClick={() => setPickerOpen(true)}
          >
            Library
          </Button>
        </div>
        <MediaPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onSelect={(item) => onChange({ ogImageUrl: item.file_url })}
        />
      </div>

      {schemaType !== undefined && onSchemaTypeChange ? (
        <div className="space-y-2">
          <Label>Schema type</Label>
          <Select
            value={schemaType}
            onValueChange={onSchemaTypeChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCHEMA_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </div>
  )
}
