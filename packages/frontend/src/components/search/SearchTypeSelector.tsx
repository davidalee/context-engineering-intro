import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import type { SearchType } from '@betweenus/shared'
import { Text } from '../Text'
import { colors } from '../../theme/colors'

interface SearchTypeSelectorProps {
  selectedType: SearchType
  onTypeChange: (type: SearchType) => void
}

interface TypeOptionProps {
  type: SearchType
  label: string
  icon: string
  isSelected: boolean
  onPress: () => void
}

function TypeOption({ label, icon, isSelected, onPress }: TypeOptionProps) {
  return (
    <TouchableOpacity
      style={[styles.typeOption, isSelected && styles.typeOptionSelected]}
      onPress={onPress}
    >
      <Text variant="body" style={styles.typeIcon}>{icon}</Text>
      <Text
        variant="caption"
        color={isSelected ? 'white' : 'textSecondary'}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export function SearchTypeSelector({ selectedType, onTypeChange }: SearchTypeSelectorProps) {
  const types: Array<{ type: SearchType; label: string; icon: string }> = [
    { type: 'name', label: 'Name', icon: '👤' },
    { type: 'keyword', label: 'Keyword', icon: '🔤' },
    { type: 'image', label: 'Image', icon: '🖼️' },
  ]

  return (
    <View style={styles.container}>
      {types.map(({ type, label, icon }) => (
        <TypeOption
          key={type}
          type={type}
          label={label}
          icon={icon}
          isSelected={selectedType === type}
          onPress={() => onTypeChange(type)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundDark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeIcon: {
    fontSize: 16,
  },
})
