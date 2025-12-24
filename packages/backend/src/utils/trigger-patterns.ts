import type { TriggerCategory } from '@betweenus/shared'

export type TriggerPattern = {
  regex: string
  severity: 'warn' | 'block'
}

export type TriggerTooltip = {
  message: string
  rewriteOptions: string[]
}

export const triggerPatterns: Record<TriggerCategory, TriggerPattern[]> = {
  diagnoses: [
    { regex: '\\b(narcissist|narcissistic)\\b', severity: 'warn' },
    { regex: '\\b(sociopath|sociopathic)\\b', severity: 'warn' },
    { regex: '\\b(psychopath|psychopathic)\\b', severity: 'warn' },
    { regex: '\\bbipolar\\b', severity: 'warn' },
    { regex: '\\bborderline\\b', severity: 'warn' },
    { regex: '\\bmentally ill\\b', severity: 'warn' },
    { regex: '\\bpersonality disorder\\b', severity: 'warn' },
    { regex: '\\bNPD\\b', severity: 'warn' },
    { regex: '\\bBPD\\b', severity: 'warn' },
  ],

  criminal_allegations: [
    { regex: '\\babusive\\b', severity: 'warn' },
    { regex: '\\brabuse[rd]?\\b', severity: 'warn' },
    { regex: '\\brapist\\b', severity: 'block' },
    { regex: '\\b(assaulted|assault)\\b', severity: 'warn' },
    { regex: '\\bpredator\\b', severity: 'warn' },
    { regex: '\\bgrooming\\b', severity: 'warn' },
    { regex: '\\bstalker\\b', severity: 'warn' },
    { regex: '\\bstalking\\b', severity: 'warn' },
    { regex: '\\btrafficker\\b', severity: 'block' },
    { regex: '\\bviolent\\b', severity: 'warn' },
    { regex: '\\bthreatening\\b', severity: 'warn' },
    { regex: '\\bdomestic violence\\b', severity: 'warn' },
  ],

  character_attacks: [
    { regex: '\\bcreep\\b', severity: 'warn' },
    { regex: '\\bmonster\\b', severity: 'warn' },
    { regex: '\\bpsycho\\b', severity: 'warn' },
    { regex: '\\bloser\\b', severity: 'warn' },
    { regex: '\\bpathetic\\b', severity: 'warn' },
    { regex: '\\bdisgusting\\b', severity: 'warn' },
    { regex: '\\btrash\\b', severity: 'warn' },
    { regex: '\\bevil\\b', severity: 'warn' },
    { regex: '\\bscum\\b', severity: 'warn' },
    { regex: '\\bfreak\\b', severity: 'warn' },
    { regex: '\\bincel\\b', severity: 'warn' },
  ],

  mind_reading: [
    { regex: "\\bhe'?s trying to\\b", severity: 'warn' },
    { regex: '\\bhe wants to\\b', severity: 'warn' },
    { regex: '\\bhe only dates to\\b', severity: 'warn' },
    { regex: '\\bhe targets women\\b', severity: 'warn' },
    { regex: '\\bhe uses women\\b', severity: 'warn' },
    { regex: '\\bhe manipulates everyone\\b', severity: 'warn' },
    { regex: "\\bhe'?s love bombing\\b", severity: 'warn' },
    { regex: "\\bhe'?s gaslighting\\b", severity: 'warn' },
  ],

  rumor_amplification: [
    { regex: '\\beveryone knows\\b', severity: 'warn' },
    { regex: '\\bI heard\\b', severity: 'warn' },
    { regex: '\\bapparently\\b', severity: 'warn' },
    { regex: '\\brumor\\b', severity: 'warn' },
    { regex: '\\bpeople say\\b', severity: 'warn' },
    { regex: '\\bmy friend said\\b', severity: 'warn' },
    { regex: '\\bI was told\\b', severity: 'warn' },
    { regex: '\\bsupposedly\\b', severity: 'warn' },
  ],

  absolute_claims: [
    { regex: '\\balways\\b', severity: 'warn' },
    { regex: '\\bnever\\b', severity: 'warn' },
    { regex: '\\bevery time\\b', severity: 'warn' },
    { regex: '\\ball women\\b', severity: 'warn' },
    { regex: '\\bhe does this to everyone\\b', severity: 'warn' },
    { regex: '\\bguaranteed\\b', severity: 'warn' },
    { regex: '\\b100%\\b', severity: 'warn' },
  ],

  doxxing: [
    {
      regex: '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b',
      severity: 'block',
    },
    {
      regex: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b',
      severity: 'block',
    },
    { regex: '\\b\\d+\\s+[A-Za-z]+\\s+(St|Street|Ave|Avenue|Rd|Road|Dr|Drive|Ln|Lane|Blvd|Boulevard)\\b', severity: 'block' },
    { regex: '\\b(works at|employed at|his job at)\\b', severity: 'warn' },
    { regex: '\\b(license plate|plate number)\\b', severity: 'block' },
    { regex: '\\b@[A-Za-z0-9_]+\\b', severity: 'warn' },
  ],

  calls_to_action: [
    { regex: '\\breport him\\b', severity: 'warn' },
    { regex: '\\bget him fired\\b', severity: 'block' },
    { regex: '\\bmessage his job\\b', severity: 'block' },
    { regex: '\\btell his wife\\b', severity: 'warn' },
    { regex: '\\bblast him\\b', severity: 'warn' },
    { regex: '\\bexpose him\\b', severity: 'warn' },
    { regex: '\\bruin him\\b', severity: 'block' },
    { regex: '\\bgo comment\\b', severity: 'warn' },
    { regex: '\\bspam him\\b', severity: 'block' },
    { regex: "\\blet'?s find him\\b", severity: 'block' },
  ],

  threats: [
    { regex: "\\bI'?ll ruin him\\b", severity: 'block' },
    { regex: "\\bhe'?ll pay\\b", severity: 'block' },
    { regex: '\\bI hope he\\b', severity: 'warn' },
    { regex: '\\bkill\\b', severity: 'block' },
    { regex: '\\bhurt him\\b', severity: 'block' },
    { regex: '\\bdox\\b', severity: 'block' },
    { regex: '\\bdestroy\\b', severity: 'warn' },
    { regex: '\\bmake sure everyone knows\\b', severity: 'warn' },
  ],

  relationship_accusations: [
    { regex: '\\bcheating\\b', severity: 'warn' },
    { regex: '\\bmarried\\b', severity: 'warn' },
    { regex: '\\bhas a wife\\b', severity: 'warn' },
    { regex: '\\bgirlfriend\\b', severity: 'warn' },
    { regex: '\\bfiancé\\b', severity: 'warn' },
    { regex: '\\baffair\\b', severity: 'warn' },
    { regex: '\\bpregnant partner\\b', severity: 'warn' },
    { regex: '\\bbaby mama\\b', severity: 'warn' },
  ],
}

export const triggerTooltips: Record<TriggerCategory, TriggerTooltip> = {
  diagnoses: {
    message: 'Avoid diagnoses. Describe what they did instead.',
    rewriteOptions: [
      'What happened was…',
      'The behavior I observed was…',
      'It made me feel unsafe when…',
    ],
  },

  criminal_allegations: {
    message:
      'Serious allegation. Please stick to specific actions you personally experienced.',
    rewriteOptions: [
      'I felt unsafe because…',
      'They did/said ___, so I ended contact.',
      'I\'m sharing what happened on [date]…',
    ],
  },

  character_attacks: {
    message: 'Stick to facts. Insults get removed—actions help others.',
    rewriteOptions: [
      'The specific issue was…',
      'On our [#] date, they…',
      'A boundary was crossed when…',
    ],
  },

  mind_reading: {
    message: 'Avoid guessing intent. Share what you saw or heard.',
    rewriteOptions: [
      'What I noticed was…',
      'They said ___.',
      'They did ___ after I ___.',
    ],
  },

  rumor_amplification: {
    message: 'No hearsay. Only post what you directly experienced.',
    rewriteOptions: [
      'In my own experience…',
      'I can only speak to what happened to me…',
      'I don\'t have firsthand info on that.',
    ],
  },

  absolute_claims: {
    message: 'Avoid absolutes. Keep it time-bound and specific.',
    rewriteOptions: [
      'In my experience on [date]…',
      'During our [#] interactions…',
      'From what I saw…',
    ],
  },

  doxxing: {
    message:
      'Personal info isn\'t allowed. Remove identifying details (address, phone, workplace, etc.).',
    rewriteOptions: [
      '(removed personal details)',
      'We met on [app] in [general area].',
      'I\'m not sharing identifying info.',
    ],
  },

  calls_to_action: {
    message: 'No harassment. Don\'t encourage others to contact or punish anyone.',
    rewriteOptions: [
      'I\'m sharing for awareness only.',
      'I chose to stop seeing him after…',
      'Use your judgment and stay safe.',
    ],
  },

  threats: {
    message: 'Not allowed. Threats or revenge language will be removed.',
    rewriteOptions: [
      'I\'m posting to share my experience.',
      'I\'m not comfortable continuing contact.',
      'This is what happened to me.',
    ],
  },

  relationship_accusations: {
    message: 'Be careful with relationship claims. Share only what you personally confirmed.',
    rewriteOptions: [
      'He told me he was single, but I later saw evidence he wasn\'t.',
      'I\'m unsure of his status—sharing what I observed.',
      'I ended contact after learning conflicting info.',
    ],
  },
}
