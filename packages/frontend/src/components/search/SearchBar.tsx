import React, { useState, useCallback, useRef, useEffect } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchBar({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search...',
  debounceMs = 500,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = useCallback((text: string) => {
    setLocalValue(text)
    onChangeText(text)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (text.trim()) {
      timeoutRef.current = setTimeout(() => {
        onSearch(text)
      }, debounceMs)
    }
  }, [onChangeText, onSearch, debounceMs])

  const handleClear = useCallback(() => {
    setLocalValue('')
    onChangeText('')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [onChangeText])

  const handleSubmit = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (localValue.trim()) {
      onSearch(localValue)
    }
  }, [localValue, onSearch])

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text variant="body" style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={localValue}
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {localValue.length > 0 && (
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
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 8,
  },
})
