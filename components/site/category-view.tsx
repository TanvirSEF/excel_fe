import { Pagination } from "@/components/shared/pagination"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { PageHeader } from "@/components/site/page-header"
import { PostGrid } from "@/components/site/post-grid"
import type { Category, Page, PostListItem } from "@/types/api"

interface CategoryViewProps {
  category: Category
  posts: Page<PostListItem>
  page: number
}

export function CategoryView({ category, posts, page }: CategoryViewProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumb
        items={[
          { label: "Categories", href: "/category/" },
          { label: category.name },
        ]}
      />

      <PageHeader
        bordered
        title={
          <>
            {category.color_hex ? (
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: category.color_hex }}
                aria-hidden
              />
            ) : null}
            {category.name}
          </>
        }
        description={category.description ?? undefined}
        meta={`${posts.total} ${posts.total === 1 ? "article" : "articles"}`}
      />

      <PostGrid
        posts={posts.items}
        emptyTitle="No articles in this category yet"
        emptyDescription="Once posts are published here they'll show up in this list."
      />

      <div className="mt-10">
        <Pagination
          page={page}
          totalPages={posts.total_pages}
          pathname={`/${category.slug}/`}
          pathBased
        />
      </div>
    </div>
  )
}
