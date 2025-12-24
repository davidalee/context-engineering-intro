import { useState, useMemo, useCallback } from 'react'
import { debounce } from 'lodash'
import type { TriggerCategory } from '@betweenus/shared'

export type ClientTrigger = {
  category: TriggerCategory
  matchedText: string
  message: string
}

const lightweightPatterns: Record<TriggerCategory, { regex: RegExp; message: string }> = {
  diagnoses: {
    regex: /\b(narcissist|sociopath|psychopath|bipolar|borderline|mentally ill|personality disorder)\b/i,
    message: 'Avoid diagnoses. Describe what they did instead.',
  },
  criminal_allegations: {
    regex: /\b(abusive|rapist|assaulted|predator|stalker|violent|threatening)\b/i,
    message: 'Serious allegation. Please stick to specific actions you experienced.',
  },
  character_attacks: {
    regex: /\b(creep|monster|psycho|loser|pathetic|disgusting|trash|evil|scum)\b/i,
    message: 'Stick to facts. Insults get removed—actions help others.',
  },
  mind_reading: {
    regex: /\b(he'?s trying to|he wants to|he targets|he uses women|he manipulates)\b/i,
    message: 'Avoid guessing intent. Share what you saw or heard.',
  },
  rumor_amplification: {
    regex: /\b(everyone knows|I heard|apparently|rumor|people say|my friend said)\b/i,
    message: 'No hearsay. Only post what you directly experienced.',
  },
  absolute_claims: {
    regex: /\b(always|never|every time|all women|100%)\b/i,
    message: 'Avoid absolutes. Keep it time-bound and specific.',
  },
  doxxing: {
    regex: /\b(\d{3}[-.]?\d{3}[-.]?\d{4}|works at|employed at)\b/i,
    message: 'Personal info isn\'t allowed. Remove identifying details.',
  },
  calls_to_action: {
    regex: /\b(report him|get him fired|tell his wife|blast him|expose him|ruin him)\b/i,
    message: 'No harassment. Don\'t encourage others to contact or punish anyone.',
  },
  threats: {
    regex: /\b(I'?ll ruin|he'?ll pay|kill|hurt him|destroy|dox)\b/i,
    message: 'Not allowed. Threats or revenge language will be removed.',
  },
  relationship_accusations: {
    regex: /\b(cheating|married|has a wife|girlfriend|fiancé|affair)\b/i,
    message: 'Be careful with relationship claims. Share only what you confirmed.',
  },
}

export function usePostValidation() {
  const [text, setText] = useState('')
  const [triggers, setTriggers] = useState<ClientTrigger[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeText = useCallback((value: string) => {
    const matches: ClientTrigger[] = []

    for (const [category, { regex, message }] of Object.entries(lightweightPatterns)) {
      const match = value.match(regex)
      if (match) {
        matches.push({
          category: category as TriggerCategory,
          matchedText: match[0],
          message,
        })
      }
    }

    setTriggers(matches)
    setIsAnalyzing(false)
  }, [])

  const debouncedAnalyze = useMemo(
    () => debounce(analyzeText, 300),
    [analyzeText]
  )

  const handleTextChange = useCallback(
    (value: string) => {
      setText(value)
      setIsAnalyzing(true)
      debouncedAnalyze(value)
    },
    [debouncedAnalyze]
  )

  const hasFirstPersonLanguage = useMemo(() => {
    return /\b(I|my|me)\b/i.test(text)
  }, [text])

  const isValidLength = useMemo(() => {
    return text.length >= 50 && text.length <= 5000
  }, [text])

  const hasBlockingTriggers = useMemo(() => {
    const blockingCategories: TriggerCategory[] = ['doxxing', 'threats', 'calls_to_action']
    return triggers.some((t) => blockingCategories.includes(t.category))
  }, [triggers])

  const isValid = useMemo(() => {
    return isValidLength && hasFirstPersonLanguage && !hasBlockingTriggers
  }, [isValidLength, hasFirstPersonLanguage, hasBlockingTriggers])

  const validationErrors = useMemo(() => {
    const errors: string[] = []
    if (text.length > 0 && text.length < 50) {
      errors.push('Posts must be at least 50 characters')
    }
    if (text.length > 5000) {
      errors.push('Posts cannot exceed 5000 characters')
    }
    if (text.length > 0 && !hasFirstPersonLanguage) {
      errors.push('Posts should use first-person language (I, my, me)')
    }
    return errors
  }, [text, hasFirstPersonLanguage])

  return {
    text,
    triggers,
    isAnalyzing,
    isValid,
    hasBlockingTriggers,
    validationErrors,
    handleTextChange,
    characterCount: text.length,
  }
}
