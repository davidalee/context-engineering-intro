import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'

interface VerificationBadgeProps {
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
}

const SIZES = {
  small: { container: 16, icon: 10 },
  medium: { container: 20, icon: 12 },
  large: { container: 24, icon: 14 },
}

export function VerificationBadge({ size = 'medium', showLabel = false }: VerificationBadgeProps) {
  const sizeConfig = SIZES[size]

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.badge,
          {
            width: sizeConfig.container,
            height: sizeConfig.container,
            borderRadius: sizeConfig.container / 2,
          },
        ]}
      >
        <Text
          variant="caption"
          color="white"
          style={[styles.icon, { fontSize: sizeConfig.icon }]}
        >
          ✓
        </Text>
      </View>
      {showLabel && (
        <Text variant="caption" style={styles.label}>
          Verified
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  label: {
    marginLeft: 4,
    color: colors.success,
    fontWeight: '500',
  },
})
