import { eq, isNull, and } from 'drizzle-orm'
import type { CreatePostInput, TriggerCategory } from '@betweenus/shared'
import { getDatabase } from '../config/database.js'
import { posts, type Post, type NewPost } from '../db/schema.js'
import { analyzeContent, type ContentAnalysisResult } from './content-filter.service.js'
import { moderateContent, isSeverelyFlagged } from './moderation.service.js'
import { generateRewrites } from './auto-rewrite.service.js'
import { brandVoicePrompts } from '../utils/brand-voice.js'

export type CreatePostResult = {
  post: Post
  analysis: ContentAnalysisResult
  requiresReview: boolean
}

export type AnalyzeResult = {
  analysis: ContentAnalysisResult
  requiresReview: boolean
}

export async function createPost(
  userId: string,
  data: CreatePostInput
): Promise<CreatePostResult> {
  const analysis = analyzeContent(data.text)

  const moderationResult = await moderateContent(data.text)

  const hasBlockingTriggers = analysis.hasBlockingTriggers
  const isFlagged = moderationResult.flags.flagged
  const isSevere = isSeverelyFlagged(moderationResult.flags)

  const requiresReview = hasBlockingTriggers || isFlagged || isSevere

  const status = requiresReview ? 'pending_review' : 'published'

  const newPost: NewPost = {
    userId,
    originalText: data.text,
    rewrittenText: null,
    status,
    moderationFlags: moderationResult.flags,
    triggerMatches: analysis.matches,
  }

  const db = getDatabase()
  const [post] = await db.insert(posts).values(newPost).returning()

  return {
    post,
    analysis,
    requiresReview,
  }
}

export async function getPostById(id: number): Promise<Post | null> {
  const db = getDatabase()
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, id), isNull(posts.deletedAt)))
    .limit(1)

  return post || null
}

export async function getPostsByUserId(userId: string): Promise<Post[]> {
  const db = getDatabase()
  const userPosts = await db
    .select()
    .from(posts)
    .where(and(eq(posts.userId, userId), isNull(posts.deletedAt)))
    .orderBy(posts.createdAt)

  return userPosts
}

export async function updatePostWithRewrite(
  id: number,
  userId: string,
  rewrittenText: string
): Promise<Post | null> {
  const db = getDatabase()
  const [updatedPost] = await db
    .update(posts)
    .set({
      rewrittenText,
      updatedAt: new Date(),
    })
    .where(and(eq(posts.id, id), eq(posts.userId, userId), isNull(posts.deletedAt)))
    .returning()

  return updatedPost || null
}

export async function deletePost(id: number, userId: string): Promise<boolean> {
  const db = getDatabase()
  const [deletedPost] = await db
    .update(posts)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(posts.id, id), eq(posts.userId, userId), isNull(posts.deletedAt)))
    .returning()

  return !!deletedPost
}

export async function analyzePostContent(text: string): Promise<AnalyzeResult> {
  const analysis = analyzeContent(text)

  const moderationResult = await moderateContent(text)

  const hasBlockingTriggers = analysis.hasBlockingTriggers
  const isFlagged = moderationResult.flags.flagged

  return {
    analysis,
    requiresReview: hasBlockingTriggers || isFlagged,
  }
}

export async function getRewriteSuggestions(
  text: string,
  triggerCategory: TriggerCategory
): Promise<string[]> {
  const result = await generateRewrites(text, triggerCategory)

  if (result.success) {
    return result.rewrites
  }

  return []
}

export function getPostFooter(): string {
  return brandVoicePrompts.footerText
}
