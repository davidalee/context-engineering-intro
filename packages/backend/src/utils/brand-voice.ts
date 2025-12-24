import type { TriggerCategory } from '@betweenus/shared'

export const brandVoicePrompts = {
  rewriteSystem: `You are a writing assistant for Between Us, a platform where people share personal dating experiences.

Your role is to help users rewrite their posts to be:
- First-person and personal ("I experienced..." not "He is...")
- Focused on specific actions and observations
- Time-bound and contextual
- Free of diagnostic labels, character judgments, or criminal allegations
- Neutral in tone, not moralizing

Guidelines:
- Keep the core facts and feelings intact
- Replace labels with observable behaviors
- Replace certainty with subjectivity ("I felt..." instead of "He is...")
- Remove any calls to action or harassment
- Anchor statements in specific dates or timeframes when possible

Do NOT:
- Make the rewrite sound clinical or legal
- Remove genuine emotional impact
- Add words like "allegedly" or "reportedly"
- Make it sound like you're defending the subject

The goal is to help the user share their experience clearly and fairly, without legal risk.

Provide exactly 3 alternative rewrites, one per line, numbered 1-3.
Each rewrite should feel natural, like a diary entry, not a courtroom statement.`,

  categoryGuidance: {
    diagnoses:
      'Remove mental health labels. Replace with specific behaviors that made the user uncomfortable.',
    criminal_allegations:
      'Replace allegations with specific actions the user personally witnessed or experienced.',
    character_attacks:
      'Remove insults and replace with factual descriptions of what happened.',
    mind_reading:
      'Replace assumptions about intent with observations of what was said or done.',
    rumor_amplification:
      'Focus only on first-hand experience. Remove hearsay or "I heard" language.',
    absolute_claims:
      'Replace "always/never" with specific instances and timeframes.',
    doxxing:
      'Remove all identifying information. Keep location general (city level at most).',
    calls_to_action:
      'Remove any suggestions to contact, report, or take action against the subject.',
    threats:
      'Remove all threatening language. Focus on the user\'s decision to end contact.',
    relationship_accusations:
      'Focus on what the user was told vs. what they later observed, without making accusations.',
  } satisfies Record<TriggerCategory, string>,

  errorMessages: {
    validationFailed: 'This post needs a few adjustments to meet our guidelines.',
    postNotFound: 'We couldn\'t find that experience. It may have been removed.',
    unauthorized: 'Please sign in to share your experience.',
    serverError: 'Something went wrong. Let\'s try again.',
    rateLimited: 'Please wait a moment before trying again.',
    moderationRequired:
      'This post has been flagged for review. Our team will take a look shortly.',
  },

  successMessages: {
    postCreated: 'Your experience has been shared.',
    postUpdated: 'Your experience has been updated.',
    rewriteGenerated: 'Here are some alternative ways to phrase this.',
  },

  confirmationCopy: {
    firstPerson: 'This reflects my personal experience',
    noHarassment: 'I won\'t harass or threaten anyone',
    understandsPublic: 'I understand this may be read by the person',
  },

  footerText: 'This reflects one person\'s experience.',

  tooltipCopy: {
    rewriteButton: 'Rewrite this',
    useThisVersion: 'Use this version',
    editManually: 'Edit manually',
    cancel: 'Cancel',
    suggestionHeader:
      'This rewrite keeps your experience intact — it only adjusts wording for clarity and fairness.',
  },
}

export function getErrorMessage(code: keyof typeof brandVoicePrompts.errorMessages): string {
  return brandVoicePrompts.errorMessages[code]
}

export function getSuccessMessage(code: keyof typeof brandVoicePrompts.successMessages): string {
  return brandVoicePrompts.successMessages[code]
}

export function getCategoryGuidance(category: TriggerCategory): string {
  return brandVoicePrompts.categoryGuidance[category]
}
