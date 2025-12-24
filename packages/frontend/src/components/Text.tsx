import React from 'react'
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native'
import { colors } from '../theme/colors'

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption'

interface TextProps extends RNTextProps {
  variant?: TextVariant
  color?: keyof typeof colors
}

export function Text({
  children,
  variant = 'body',
  color = 'text',
  style,
  ...props
}: TextProps) {
  return (
    <RNText style={[styles[variant], { color: colors[color] }, style]} {...props}>
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
  },
})
