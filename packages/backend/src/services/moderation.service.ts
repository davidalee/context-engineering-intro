import { openai } from '../config/openai.js'
import { logger } from '../utils/index.js'
import type { ModerationFlags } from '../db/schema.js'

export type ModerationResult = {
  flags: ModerationFlags
  success: boolean
  error?: string
}

export async function moderateContent(text: string): Promise<ModerationResult> {
  try {
    const response = await openai.moderations.create({
      input: text,
    })

    const result = response.results[0]

    if (!result) {
      return {
        flags: createEmptyFlags(),
        success: false,
        error: 'No moderation result returned',
      }
    }

    const flags: ModerationFlags = {
      flagged: result.flagged,
      categories: {
        hate: result.categories.hate || result.categories['hate/threatening'],
        harassment:
          result.categories.harassment || result.categories['harassment/threatening'],
        sexual: result.categories.sexual || result.categories['sexual/minors'],
        violence: result.categories.violence || result.categories['violence/graphic'],
        'self-harm':
          result.categories['self-harm'] ||
          result.categories['self-harm/intent'] ||
          result.categories['self-harm/instructions'],
      },
      category_scores: {
        hate: result.category_scores.hate,
        harassment: result.category_scores.harassment,
        sexual: result.category_scores.sexual,
        violence: result.category_scores.violence,
        'self-harm': result.category_scores['self-harm'],
      },
    }

    return {
      flags,
      success: true,
    }
  } catch (error) {
    logger.error('Error moderating content:', error)

    return {
      flags: createEmptyFlags(),
      success: false,
      error: 'Failed to moderate content',
    }
  }
}

function createEmptyFlags(): ModerationFlags {
  return {
    flagged: false,
    categories: {
      hate: false,
      harassment: false,
      sexual: false,
      violence: false,
      'self-harm': false,
    },
    category_scores: {
      hate: 0,
      harassment: 0,
      sexual: 0,
      violence: 0,
      'self-harm': 0,
    },
  }
}

export function isSeverelyFlagged(flags: ModerationFlags): boolean {
  const threshold = 0.8

  return (
    flags.category_scores.hate > threshold ||
    flags.category_scores.harassment > threshold ||
    flags.category_scores.violence > threshold
  )
}
