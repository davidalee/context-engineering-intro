import { getTinEyeConfig, isTinEyeConfigured } from '../config/tineye.js'
import { logger } from '../utils/index.js'
import type { ImageSearchResult, ImageSearchResponse } from '@betweenus/shared'

interface TinEyeMatch {
  score: number
  image_url: string
  backlinks: Array<{
    url: string
    backlink: string
  }>
}

interface TinEyeApiResponse {
  results: {
    total_results: number
    matches: TinEyeMatch[]
  }
}

export class ImageSearchError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message)
    this.name = 'ImageSearchError'
  }
}

export async function searchByImage(
  imageData: string,
  _location?: string,
  limit: number = 10
): Promise<ImageSearchResponse> {
  if (!isTinEyeConfigured()) {
    throw new ImageSearchError('Image search is not configured', 503)
  }

  const config = getTinEyeConfig()

  try {
    const imageBuffer = Buffer.from(imageData, 'base64')

    if (imageBuffer.length > 20 * 1024 * 1024) {
      throw new ImageSearchError('Image exceeds maximum size of 20MB', 400)
    }

    const formData = new FormData()
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
    formData.append('image', blob, 'search.jpg')
    formData.append('limit', String(limit))
    formData.append('sort', 'score')
    formData.append('order', 'desc')

    const response = await fetch(`${config.baseUrl}/search/`, {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey!,
      },
      body: formData,
    })

    if (!response.ok) {
      if (response.status === 429) {
        logger.warn('TinEye rate limit exceeded')
        throw new ImageSearchError('Rate limit exceeded. Please try again later.', 429)
      }
      if (response.status === 401) {
        logger.error('TinEye authentication failed')
        throw new ImageSearchError('Image search authentication failed', 500)
      }
      throw new ImageSearchError(`Image search failed: ${response.status}`, 500)
    }

    const data = await response.json() as TinEyeApiResponse

    const results: ImageSearchResult[] = data.results.matches.map((match) => ({
      postId: 0,
      preview: match.backlinks[0]?.url
        ? `Found on: ${new URL(match.backlinks[0].url).hostname}`
        : 'Unknown source',
      matchScore: match.score,
      matchConfidence: Math.round(match.score * 100),
      createdAt: new Date().toISOString(),
      overlapCount: 1,
      imageUrl: match.image_url,
    }))

    logger.info('Image search completed', {
      resultCount: results.length,
      totalResults: data.results.total_results,
    })

    return {
      results,
      totalCount: data.results.total_results,
    }
  } catch (error) {
    if (error instanceof ImageSearchError) {
      throw error
    }
    logger.error('TinEye search failed', { error })
    throw new ImageSearchError('Image search failed unexpectedly', 500)
  }
}
