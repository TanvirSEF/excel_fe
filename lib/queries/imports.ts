import { useMutation } from "@tanstack/react-query"

import { runWordPressImport } from "@/lib/api/imports"

export function useWordPressImport() {
  return useMutation({
    mutationFn: ({
      file,
      dryRun,
      includeImages,
    }: {
      file: File
      dryRun: boolean
      includeImages: boolean
    }) => runWordPressImport(file, dryRun, includeImages),
  })
}
