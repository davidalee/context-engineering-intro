import React, { useEffect, useCallback } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { SearchResult } from '@betweenus/shared'
import { Text } from '../../components/Text'
import { SearchResultCard, SaveAlertButton } from '../../components/search'
import { useSearch } from '../../hooks/useSearch'
import { useAlerts } from '../../hooks/useAlerts'
import { colors } from '../../theme/colors'
import type { AppStackParamList } from '../../navigation/AppNavigator'

type Props = NativeStackScreenProps<AppStackParamList, 'SearchResults'>

export function SearchResultsScreen({ route }: Props) {
  const { type, query, location } = route.params

  const {
    results,
    isLoading,
    error,
    hasMore,
    search,
    loadMore,
  } = useSearch()

  const { createAlert, canCreateMore } = useAlerts()

  useEffect(() => {
    if (type !== 'image' && query) {
      search(type, query, location)
    }
  }, [type, query, location, search])

  const handleSaveAlert = useCallback(async (name: string, alertLocation?: string) => {
    const alert = await createAlert(name, alertLocation)
    return alert !== null
  }, [createAlert])

  const renderResult = useCallback(({ item }: { item: SearchResult }) => (
    <SearchResultCard
      result={item}
      onPress={() => {}}
    />
  ), [])

  const renderHeader = () => (
    <View style={styles.header}>
      <Text variant="h3" color="text" style={styles.title}>
        Experiences shared about "{query}"
      </Text>
      {location && (
        <Text variant="caption" color="textMuted" style={styles.locationText}>
          📍 Filtered by: {location}
        </Text>
      )}
      {type === 'name' && results.length > 0 && (
        <View style={styles.alertButtonContainer}>
          <SaveAlertButton
            name={query}
            location={location}
            onSave={handleSaveAlert}
            atLimit={!canCreateMore}
          />
        </View>
      )}
    </View>
  )

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="body" color="textMuted" style={styles.loadingText}>
            Searching...
          </Text>
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="error">{error}</Text>
        </View>
      )
    }

    return (
      <View style={styles.emptyContainer}>
        <Text variant="h3" color="textSecondary" style={styles.emptyTitle}>
          No matching experiences found
        </Text>
        <Text variant="body" color="textMuted" style={styles.emptyText}>
          This name hasn't been mentioned yet.
        </Text>
      </View>
    )
  }

  const renderFooter = () => {
    if (!hasMore || !isLoading) return null

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.postId)}
        renderItem={renderResult}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 4,
  },
  locationText: {
    marginBottom: 12,
  },
  alertButtonContainer: {
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
})
