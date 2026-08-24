"use client"

import { useRef, useState } from "react"
import { IconUpload } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useWordPressImport } from "@/lib/queries/imports"
import { cn } from "@/lib/utils"
import type { WpImportResult } from "@/types/api"

export function WpImportPanel() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dryRun, setDryRun] = useState(true)
  const [includeImages, setIncludeImages] = useState(false)
  const [result, setResult] = useState<WpImportResult | null>(null)

  const importMutation = useWordPressImport()

  function onFileSelected(file: File) {
    if (!file.name.endsWith(".xml")) {
      toast.error("Please select a WordPress WXR .xml export file.")
      return
    }
    setSelectedFile(file)
    setResult(null)
  }

  async function onRun() {
    if (!selectedFile) {
      toast.error("Select a .xml file first.")
      return
    }
    try {
      const data = await importMutation.mutateAsync({
        file: selectedFile,
        dryRun,
        includeImages,
      })
      setResult(data)
      toast.success(dryRun ? "Dry run complete." : "Import complete.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Import failed. Try again.",
      )
    }
  }

  return (
    <section className="space-y-4 rounded-xl border p-5">
      <div>
        <h2 className="text-sm font-semibold">WordPress Migration</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Upload a WXR .xml export to import posts, categories, tags, comments
          and redirects.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Select WXR file"
        onClick={() => fileInput.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInput.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) onFileSelected(file)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "hover:border-primary/50 hover:bg-accent/40",
        )}
      >
        <IconUpload className="size-5 text-muted-foreground" />
        {selectedFile ? (
          <p className="text-sm font-medium">{selectedFile.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium">Drop .xml here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              WordPress WXR export (Tools → Export → All content)
            </p>
          </>
        )}
      </div>

      <input
        ref={fileInput}
        type="file"
        accept=".xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelected(file)
          e.target.value = ""
        }}
      />

      <div className="flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            className="rounded border-input"
          />
          Dry run (parse only, no writes)
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeImages}
            onChange={(e) => setIncludeImages(e.target.checked)}
            className="rounded border-input"
          />
          Download &amp; re-upload images to R2
        </label>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={onRun}
        disabled={!selectedFile || importMutation.isPending}
      >
        {importMutation.isPending
          ? "Running…"
          : dryRun
            ? "Run dry run"
            : "Run import"}
      </Button>

      {result && <ImportResultCard result={result} />}
    </section>
  )
}

function ImportResultCard({ result }: { result: WpImportResult }) {
  const stats = result.dry_run
    ? [
        { label: "Posts found", value: result.total_posts },
        { label: "Categories", value: result.categories },
        { label: "Tags", value: result.tags },
      ]
    : [
        { label: "Posts created", value: result.posts_created },
        { label: "Posts updated", value: result.posts_updated },
        { label: "Categories", value: result.categories },
        { label: "Tags", value: result.tags },
        { label: "Redirects", value: result.redirects },
        { label: "Images uploaded", value: result.images_uploaded },
        { label: "Images failed", value: result.images_failed },
      ]

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          {result.dry_run ? "Dry run result" : "Import complete"}
          {result.site_title ? ` — ${result.site_title}` : ""}
        </p>
        {result.dry_run && (
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400">
            No writes made
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-md border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </div>
      {!result.dry_run && result.images_failed > 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {result.images_failed} image(s) could not be downloaded — original
          URLs kept.
        </p>
      )}
    </div>
  )
}
