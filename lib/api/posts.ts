import { serverFetch } from "@/lib/api/server-fetch"
import type { Comment, Page, PostDetail, PostListItem } from "@/types/api"

export interface PostListParams {
  page?: number
  page_size?: number
  category?: string
  tag?: string
  trending?: boolean
  author?: string
}

export function getPosts(params: PostListParams = {}, revalidate = 60) {
  return serverFetch<Page<PostListItem>>("/posts", {
    revalidate,
    searchParams: {
      page: params.page,
      page_size: params.page_size,
      category: params.category,
      tag: params.tag,
      trending: params.trending,
      author: params.author,
    },
  })
}

export function getPostBySlug(slug: string, revalidate = 60) {
  return serverFetch<PostDetail>(`/posts/${encodeURIComponent(slug)}`, {
    revalidate,
    tags: ["post", slug],
  })
}

export function getPostComments(postId: string, revalidate = 60) {
  return serverFetch<Comment[]>(`/posts/${postId}/comments`, {
    revalidate,
    tags: ["post", postId, "comments"],
  })
}
