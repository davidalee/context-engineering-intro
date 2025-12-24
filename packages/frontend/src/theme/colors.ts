export const colors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',

  secondary: '#EC4899',
  secondaryDark: '#DB2777',
  secondaryLight: '#F472B6',

  background: '#FFFFFF',
  backgroundDark: '#F9FAFB',
  surface: '#FFFFFF',

  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  border: '#E5E7EB',
  borderDark: '#D1D5DB',

  success: '#10B981',
  successBackground: '#D1FAE5',
  warning: '#F59E0B',
  warningBackground: '#FEF3C7',
  error: '#EF4444',
  errorBackground: '#FEE2E2',
  info: '#3B82F6',
  infoBackground: '#DBEAFE',

  white: '#FFFFFF',
  black: '#000000',
} as const

export type ColorKey = keyof typeof colors
