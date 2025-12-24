import { eq, desc, sql, and, ilike, count, isNull } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { posts } from '../db/schema.js'
import { logger } from '../utils/index.js'
import type { SearchResult, SearchResponse } from '@betweenus/shared'

function normalizeSearchQuery(query: string, joinWith: '&' | '|' = '&'): string {
  return query
    .trim()
    .split(/\s+/)
    .map(word => word.replace(/[^\w]/g, ''))
    .filter(word => word.length > 0)
    .join(` ${joinWith} `)
}

export async function searchByName(
  query: string,
  location?: string,
  limit: number = 20,
  cursor?: string
): Promise<SearchResponse> {
  const db = getDatabase()
  const tsQuery = normalizeSearchQuery(query, '&')

  if (!tsQuery) {
    return { results: [], totalCount: 0, hasMore: false }
  }

  const conditions = [
    sql`to_tsvector('english', coalesce(${posts.subjectName}, '') || ' ' || ${posts.originalText}) @@ to_tsquery('english', ${tsQuery})`,
    eq(posts.status, 'published'),
    isNull(posts.deletedAt),
  ]

  if (location) {
    conditions.push(ilike(posts.location, `%${location}%`))
  }

  if (cursor) {
    conditions.push(sql`${posts.id} < ${parseInt(cursor, 10)}`)
  }

  const results = await db
    .select({
      id: posts.id,
      subjectName: posts.subjectName,
      originalText: posts.originalText,
      location: posts.location,
      createdAt: posts.createdAt,
      rank: sql<number>`ts_rank(
        to_tsvector('english', coalesce(${posts.subjectName}, '') || ' ' || ${posts.originalText}),
        to_tsquery('english', ${tsQuery})
      )`,
    })
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(sql`ts_rank(
      to_tsvector('english', coalesce(${posts.subjectName}, '') || ' ' || ${posts.originalText}),
      to_tsquery('english', ${tsQuery})
    )`))
    .limit(limit + 1)

  const hasMore = results.length > limit
  const items = hasMore ? results.slice(0, -1) : results

  const searchResults: SearchResult[] = await Promise.all(
    items.map(async (item) => {
      let overlapCount = 1
      if (item.subjectName) {
        const [countResult] = await db
          .select({ count: count() })
          .from(posts)
          .where(and(
            ilike(posts.subjectName, item.subjectName),
            eq(posts.status, 'published'),
            isNull(posts.deletedAt)
          ))
        overlapCount = countResult?.count || 1
      }

      return {
        postId: item.id,
        preview: item.originalText.slice(0, 200) + (item.originalText.length > 200 ? '...' : ''),
        subjectName: item.subjectName || undefined,
        location: item.location || undefined,
        matchScore: item.rank,
        createdAt: item.createdAt.toISOString(),
        overlapCount,
      }
    })
  )

  logger.info('Name search completed', {
    query,
    location,
    resultCount: searchResults.length,
    hasMore,
  })

  return {
    results: searchResults,
    totalCount: searchResults.length,
    hasMore,
    cursor: hasMore && items.length > 0 ? String(items[items.length - 1].id) : undefined,
  }
}

export async function searchByKeyword(
  query: string,
  location?: string,
  limit: number = 20,
  cursor?: string
): Promise<SearchResponse> {
  const db = getDatabase()
  const tsQuery = normalizeSearchQuery(query, '|')

  if (!tsQuery) {
    return { results: [], totalCount: 0, hasMore: false }
  }

  const conditions = [
    sql`to_tsvector('english', ${posts.originalText}) @@ to_tsquery('english', ${tsQuery})`,
    eq(posts.status, 'published'),
    isNull(posts.deletedAt),
  ]

  if (location) {
    conditions.push(ilike(posts.location, `%${location}%`))
  }

  if (cursor) {
    conditions.push(sql`${posts.id} < ${parseInt(cursor, 10)}`)
  }

  const results = await db
    .select({
      id: posts.id,
      subjectName: posts.subjectName,
      originalText: posts.originalText,
      location: posts.location,
      createdAt: posts.createdAt,
      rank: sql<number>`ts_rank(
        to_tsvector('english', ${posts.originalText}),
        to_tsquery('english', ${tsQuery})
      )`,
    })
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(sql`ts_rank(
      to_tsvector('english', ${posts.originalText}),
      to_tsquery('english', ${tsQuery})
    )`))
    .limit(limit + 1)

  const hasMore = results.length > limit
  const items = hasMore ? results.slice(0, -1) : results

  logger.info('Keyword search completed', {
    query,
    location,
    resultCount: items.length,
    hasMore,
  })

  return {
    results: items.map(item => ({
      postId: item.id,
      preview: item.originalText.slice(0, 200) + (item.originalText.length > 200 ? '...' : ''),
      subjectName: item.subjectName || undefined,
      location: item.location || undefined,
      matchScore: item.rank,
      createdAt: item.createdAt.toISOString(),
      overlapCount: 1,
    })),
    totalCount: items.length,
    hasMore,
    cursor: hasMore && items.length > 0 ? String(items[items.length - 1].id) : undefined,
  }
}
