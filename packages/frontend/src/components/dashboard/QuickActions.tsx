import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from '../Text'
import { colors } from '../../theme/colors'
import type { AppStackParamList } from '../../navigation/AppNavigator'

interface QuickActionsProps {
  navigation: NativeStackNavigationProp<AppStackParamList, keyof AppStackParamList>
  isVerified: boolean
}

interface ActionButtonProps {
  icon: string
  label: string
  onPress: () => void
  variant?: 'default' | 'primary'
}

function ActionButton({ icon, label, onPress, variant = 'default' }: ActionButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <TouchableOpacity
      style={[styles.actionButton, isPrimary && styles.actionButtonPrimary]}
      onPress={onPress}
    >
      <Text variant="h3" style={styles.actionIcon}>
        {icon}
      </Text>
      <Text
        variant="caption"
        color={isPrimary ? 'white' : 'text'}
        style={styles.actionLabel}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export function QuickActions({ navigation, isVerified }: QuickActionsProps) {
  const handleShareExperience = () => {
    navigation.navigate('PostCreation')
  }

  const handleViewPosts = () => {
    navigation.navigate('Home')
  }

  const handleGetVerified = () => {
    navigation.navigate('VerificationIntro')
  }

  return (
    <View style={styles.container}>
      <ActionButton
        icon="📝"
        label="Share an experience"
        onPress={handleShareExperience}
        variant="primary"
      />
      <ActionButton
        icon="📋"
        label="View my posts"
        onPress={handleViewPosts}
      />
      {!isVerified && (
        <ActionButton
          icon="✓"
          label="Get verified"
          onPress={handleGetVerified}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionLabel: {
    textAlign: 'center',
  },
})
