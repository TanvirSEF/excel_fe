export type UserRole =
  | "super_admin"
  | "senior_editor"
  | "technical_writer"
  | "seo_specialist"

export type PostStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected"
  | "scheduled"

export type CommentStatus = "pending" | "approved" | "spam" | "rejected"

export interface Page<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ApiError {
  error: {
    code: string
    message: string
    status: number
    details?: { field: string; message: string }[]
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar_url: string | null
  bio: string | null
  is_active: boolean
  is_verified: boolean
  last_login_at: string | null
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: "bearer"
}

export interface PostListItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  reading_time_minutes: number | null
  is_trending: boolean
  view_count: number
  published_at: string | null
}

export interface PostDetail extends PostListItem {
  content_json: ContentDoc
  content_html: string | null
  status: PostStatus
  author_id: string
  author_name: string
  category_id: string | null
  category_name: string | null
  category_slug: string | null
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  canonical_url: string | null
  og_image_url: string | null
  schema_type: string
  scheduled_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface PostAdminItem {
  id: string
  title: string
  slug: string
  status: PostStatus
  author_name: string
  category_name: string | null
  rejection_reason: string | null
  updated_at: string
  published_at: string | null
}

export interface PostCreateInput {
  title: string
  slug?: string
  excerpt?: string
  content_json: ContentDoc
  featured_image_url?: string | null
  category_id?: string | null
  tags?: string[]
  meta_title?: string
  meta_description?: string
  canonical_url?: string | null
  og_image_url?: string | null
  schema_type?: string
}
export type PostUpdateInput = Partial<PostCreateInput>

export interface SeoUpdateInput {
  meta_title?: string
  meta_description?: string
  canonical_url?: string | null
  og_image_url?: string | null
}

export interface ContentDoc {
  blocks: Block[]
}
export type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: number }
  | { type: "quote"; text: string }
  | { type: "code"; text: string; language?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "html"; html: string }
  | { type: "image"; url: string; alt?: string }
  | { type: "table"; rows: string[][]; header?: boolean }

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  order_index: number
  description: string | null
  icon_url: string | null
  color_hex: string | null
  is_featured: boolean
  seo_title: string | null
  seo_description: string | null
  children: Category[]
}
export interface CategoryWithPosts {
  category: Category
  posts: Page<PostListItem>
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Comment {
  id: string
  parent_id: string | null
  user_name: string
  comment_text: string
  created_at: string
  children: Comment[]
}
export interface CommentCreateInput {
  user_name: string
  user_email: string
  comment_text: string
  parent_id?: string | null
}

export interface CommentAdminItem extends Comment {
  user_email: string
  status: CommentStatus
  ip_address: string | null
  post_title: string
  post_slug: string
}

export interface MediaItem {
  id: string
  file_url: string
  file_type: string
  alt_text: string | null
  width: number | null
  height: number | null
  size_kb: number | null
  folder: string
  created_at: string
}

export interface DownloadableAsset {
  id: string
  post_id: string
  file_name: string
  file_url: string
  file_type: string
  file_size_kb: number | null
  download_count: number
  created_at: string
}

export interface DownloadUrlResponse {
  url: string
  expires_in: number
}

export interface PostAnalytics {
  post_id: string
  title: string
  slug: string
  total_views: number
  views_last_7_days: { date: string; views: number }[]
  views_last_30_days: number
  unique_visitors_30_days: number
  top_referrers_30_days: { referrer: string; views: number }[]
}

export interface OverviewAnalytics {
  total_posts: number
  published_posts: number
  draft_posts: number
  total_views: number
  views_last_7_days: number
  top_posts_7_days: {
    post_id: string
    title: string
    slug: string
    views: number
  }[]
  trending: { id: string; title: string; slug: string }[]
}

export interface AuditLog {
  id: number
  user_id: string | null
  actor_name: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface WpImportResult {
  dry_run: boolean
  site_title: string
  total_posts: number
  posts_created: number
  posts_updated: number
  categories: number
  tags: number
  redirects: number
  images_uploaded: number
  images_failed: number
}
