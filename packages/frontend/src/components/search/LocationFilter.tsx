import React from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'

interface LocationFilterProps {
  value: string
  onChangeText: (text: string) => void
}

export function LocationFilter({ value, onChangeText }: LocationFilterProps) {
  const handleClear = () => {
    onChangeText('')
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text variant="body" style={styles.locationIcon}>📍</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Filter by location (optional)"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text variant="caption" color="textMuted">✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  locationIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: colors.text,
  },
  clearButton: {
    padding: 8,
  },
})
