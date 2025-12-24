import React, { useState, useCallback } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'
import { usePostValidation } from '../../hooks/usePostValidation'
import { InlineTooltip } from './InlineTooltip'
import { RewriteSuggestion } from './RewriteSuggestion'
import { ConfirmationChecklist, type Confirmations } from './ConfirmationChecklist'
import { createPost, requestRewrite } from '../../services/posts.service'
import type { TriggerCategory } from '@betweenus/shared'

interface PostFormProps {
  onSuccess: () => void
}

export function PostForm({ onSuccess }: PostFormProps) {
  const {
    text,
    triggers,
    isValid,
    hasBlockingTriggers,
    validationErrors,
    handleTextChange,
    characterCount,
  } = usePostValidation()

  const [confirmations, setConfirmations] = useState<Confirmations>({
    firstPerson: false,
    noHarassment: false,
    understandsPublic: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingRewrite, setIsLoadingRewrite] = useState(false)
  const [rewriteSuggestions, setRewriteSuggestions] = useState<string[] | null>(
    null
  )
  const [activeRewriteCategory, setActiveRewriteCategory] =
    useState<TriggerCategory | null>(null)

  const allConfirmed = Object.values(confirmations).every(Boolean)
  const canSubmit = isValid && allConfirmed && !isSubmitting

  const handleConfirmationChange = useCallback((key: keyof Confirmations) => {
    setConfirmations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }, [])

  const handleRewriteRequest = useCallback(
    async (category: TriggerCategory, matchedText: string) => {
      setIsLoadingRewrite(true)
      setActiveRewriteCategory(category)

      try {
        const response = await requestRewrite(matchedText, category)
        setRewriteSuggestions(response.data.suggestions)
      } catch (error) {
        Alert.alert(
          'Unable to generate suggestions',
          'Please try again or edit manually.'
        )
      } finally {
        setIsLoadingRewrite(false)
      }
    },
    []
  )

  const handleSelectRewrite = useCallback(
    (newText: string) => {
      const trigger = triggers.find((t) => t.category === activeRewriteCategory)
      if (trigger) {
        const updatedText = text.replace(trigger.matchedText, newText)
        handleTextChange(updatedText)
      }
      setRewriteSuggestions(null)
      setActiveRewriteCategory(null)
    },
    [text, triggers, activeRewriteCategory, handleTextChange]
  )

  const handleDismissRewrite = useCallback(() => {
    setRewriteSuggestions(null)
    setActiveRewriteCategory(null)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return

    setIsSubmitting(true)

    try {
      await createPost({
        text,
        confirmations: confirmations as {
          firstPerson: true
          noHarassment: true
          understandsPublic: true
        },
      })

      Alert.alert('Experience shared', 'Your experience has been posted.', [
        { text: 'OK', onPress: onSuccess },
      ])
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      Alert.alert('Unable to share', message)
    } finally {
      setIsSubmitting(false)
    }
  }, [canSubmit, text, confirmations, onSuccess])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="h2">Share your experience</Text>
          <Text variant="body" color="textSecondary" style={styles.subtitle}>
            Describe what happened in your own words
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="What happened? Use first-person language (I, my, me) and describe specific actions..."
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            value={text}
            onChangeText={handleTextChange}
            editable={!isSubmitting}
          />
          <View style={styles.characterCount}>
            <Text
              variant="caption"
              color={characterCount < 50 ? 'error' : 'textMuted'}
            >
              {characterCount}/5000
            </Text>
          </View>
        </View>

        {validationErrors.length > 0 && (
          <View style={styles.errorsContainer}>
            {validationErrors.map((error, index) => (
              <Text key={index} variant="caption" color="error">
                {error}
              </Text>
            ))}
          </View>
        )}

        {triggers.map((trigger, index) => (
          <InlineTooltip
            key={`${trigger.category}-${index}`}
            category={trigger.category}
            message={trigger.message}
            matchedText={trigger.matchedText}
            onRewriteRequest={() =>
              handleRewriteRequest(trigger.category, trigger.matchedText)
            }
            isLoading={
              isLoadingRewrite && activeRewriteCategory === trigger.category
            }
          />
        ))}

        {rewriteSuggestions && (
          <RewriteSuggestion
            suggestions={rewriteSuggestions}
            onSelect={handleSelectRewrite}
            onDismiss={handleDismissRewrite}
          />
        )}

        {hasBlockingTriggers && (
          <View style={styles.blockingWarning}>
            <Text variant="body" color="error">
              This post contains content that needs to be adjusted before
              sharing. Please use the rewrite suggestions above.
            </Text>
          </View>
        )}

        {isValid && !hasBlockingTriggers && (
          <ConfirmationChecklist
            confirmations={confirmations}
            onChange={handleConfirmationChange}
          />
        )}

        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text variant="body" color="white">
              Share experience
            </Text>
          )}
        </TouchableOpacity>

        <Text variant="caption" color="textMuted" style={styles.footer}>
          This reflects one person&apos;s experience.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  textInput: {
    minHeight: 200,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  characterCount: {
    alignItems: 'flex-end',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  errorsContainer: {
    marginBottom: 8,
  },
  blockingWarning: {
    backgroundColor: colors.errorBackground,
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  footer: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
})
