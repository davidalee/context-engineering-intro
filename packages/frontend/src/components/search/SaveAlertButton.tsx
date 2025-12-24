import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'

interface SaveAlertButtonProps {
  name: string
  location?: string
  onSave: (name: string, location?: string) => Promise<boolean>
  disabled?: boolean
  atLimit?: boolean
}

export function SaveAlertButton({
  name,
  location,
  onSave,
  disabled = false,
  atLimit = false,
}: SaveAlertButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handlePress = async () => {
    if (disabled || isSaving || isSaved || atLimit) return

    setIsSaving(true)
    const success = await onSave(name, location)
    setIsSaving(false)

    if (success) {
      setIsSaved(true)
    }
  }

  const getButtonText = () => {
    if (isSaved) return 'Alert saved'
    if (atLimit) return 'Alert limit reached'
    return 'Save as alert'
  }

  const isDisabled = disabled || isSaving || isSaved || atLimit

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSaved && styles.buttonSaved,
        isDisabled && styles.buttonDisabled,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
    >
      {isSaving ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <>
          <Text variant="caption" style={styles.icon}>
            {isSaved ? '✓' : '🔔'}
          </Text>
          <Text
            variant="body"
            color={isSaved ? 'white' : 'primary'}
            style={styles.text}
          >
            {getButtonText()}
          </Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonSaved: {
    backgroundColor: colors.success,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    fontWeight: '600',
  },
})
