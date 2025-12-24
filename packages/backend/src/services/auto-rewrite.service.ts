import type { TriggerCategory } from '@betweenus/shared'
import {
  openai,
  OPENAI_MODEL,
  OPENAI_REWRITE_MAX_TOKENS,
  OPENAI_REWRITE_TEMPERATURE,
} from '../config/openai.js'
import { brandVoicePrompts, getCategoryGuidance } from '../utils/brand-voice.js'
import { logger } from '../utils/index.js'

export type RewriteResult = {
  rewrites: string[]
  success: boolean
  error?: string
}

export async function generateRewrites(
  text: string,
  triggerCategory: TriggerCategory
): Promise<RewriteResult> {
  try {
    const categoryGuidance = getCategoryGuidance(triggerCategory)

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: brandVoicePrompts.rewriteSystem,
        },
        {
          role: 'user',
          content: `The following text triggered our "${triggerCategory}" filter.

Specific guidance for this category: ${categoryGuidance}

Please rewrite this to be clearer and safer while keeping the core experience intact:

"${text}"

Provide exactly 3 alternative rewrites, numbered 1-3.`,
        },
      ],
      temperature: OPENAI_REWRITE_TEMPERATURE,
      max_tokens: OPENAI_REWRITE_MAX_TOKENS,
    })

    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      return {
        rewrites: [],
        success: false,
        error: 'No response from AI service',
      }
    }

    const rewrites = parseRewrites(responseText)

    if (rewrites.length === 0) {
      return {
        rewrites: [],
        success: false,
        error: 'Could not parse rewrites from response',
      }
    }

    return {
      rewrites,
      success: true,
    }
  } catch (error) {
    logger.error('Error generating rewrites:', error)

    return {
      rewrites: [],
      success: false,
      error: 'Failed to generate rewrites',
    }
  }
}

function parseRewrites(responseText: string): string[] {
  const lines = responseText.split('\n').filter((line) => line.trim().length > 0)

  const rewrites: string[] = []

  for (const line of lines) {
    const cleaned = line
      .replace(/^\d+[.):\s]+/, '')
      .replace(/^["']|["']$/g, '')
      .trim()

    if (cleaned.length > 10) {
      rewrites.push(cleaned)
    }

    if (rewrites.length >= 3) {
      break
    }
  }

  return rewrites
}
