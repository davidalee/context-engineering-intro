import type { TriggerCategory } from '@betweenus/shared'
import { triggerPatterns, triggerTooltips } from '../utils/trigger-patterns.js'
import type { TriggerMatch } from '../db/schema.js'

export type ContentAnalysisResult = {
  matches: TriggerMatch[]
  hasBlockingTriggers: boolean
  tooltips: Array<{
    category: TriggerCategory
    message: string
    rewriteOptions: string[]
    matchedText: string
    position: number
  }>
}

export function analyzeContent(text: string): ContentAnalysisResult {
  const matches: TriggerMatch[] = []

  for (const [category, patterns] of Object.entries(triggerPatterns)) {
    for (const pattern of patterns) {
      const regex = new RegExp(pattern.regex, 'gi')
      let match: RegExpExecArray | null

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          category,
          matched_text: match[0],
          position: match.index,
          severity: pattern.severity,
        })
      }
    }
  }

  const sortedMatches = matches.sort((a, b) => a.position - b.position)

  const seenCategories = new Set<string>()
  const tooltips = sortedMatches
    .filter((match) => {
      if (seenCategories.has(match.category)) {
        return false
      }
      seenCategories.add(match.category)
      return true
    })
    .map((match) => {
      const tooltip = triggerTooltips[match.category as TriggerCategory]
      return {
        category: match.category as TriggerCategory,
        message: tooltip.message,
        rewriteOptions: tooltip.rewriteOptions,
        matchedText: match.matched_text,
        position: match.position,
      }
    })

  const hasBlockingTriggers = sortedMatches.some((m) => m.severity === 'block')

  return {
    matches: sortedMatches,
    hasBlockingTriggers,
    tooltips,
  }
}

export function hasBlockingContent(text: string): boolean {
  const result = analyzeContent(text)
  return result.hasBlockingTriggers
}

export function getMatchedCategories(text: string): TriggerCategory[] {
  const result = analyzeContent(text)
  const categories = new Set(result.matches.map((m) => m.category as TriggerCategory))
  return Array.from(categories)
}
