import React, { useState, useCallback } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { SearchType, SearchResult } from '@betweenus/shared'
import { Text } from '../../components/Text'
import {
  SearchBar,
  SearchTypeSelector,
  LocationFilter,
  ImageUploader,
  SearchResultCard,
  SaveAlertButton,
} from '../../components/search'
import { useSearch } from '../../hooks/useSearch'
import { useAlerts } from '../../hooks/useAlerts'
import { colors } from '../../theme/colors'
import type { AppStackParamList } from '../../navigation/AppNavigator'

type Props = NativeStackScreenProps<AppStackParamList, 'Search'>

export function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')

  const {
    results,
    isLoading,
    error,
    hasMore,
    searchType,
    search,
    searchImage,
    loadMore,
    setSearchType,
  } = useSearch()

  const { createAlert, canCreateMore } = useAlerts()

  const handleSearch = useCallback((searchQuery: string) => {
    if (searchType !== 'image') {
      search(searchType, searchQuery, location || undefined)
    }
  }, [search, searchType, location])

  const handleTypeChange = useCallback((type: SearchType) => {
    setSearchType(type)
    if (query && type !== 'image') {
      search(type, query, location || undefined)
    }
  }, [setSearchType, search, query, location])

  const handleImageSelected = useCallback((imageData: string) => {
    searchImage(imageData, location || undefined)
  }, [searchImage, location])

  const handleResultPress = useCallback((result: SearchResult) => {
    navigation.navigate('SearchResults', {
      type: searchType,
      query: result.subjectName || query,
      location: location || undefined,
    })
  }, [navigation, searchType, query, location])

  const handleSaveAlert = useCallback(async (name: string, alertLocation?: string) => {
    const alert = await createAlert(name, alertLocation)
    return alert !== null
  }, [createAlert])

  const renderResult = useCallback(({ item }: { item: SearchResult }) => (
    <SearchResultCard
      result={item}
      onPress={() => handleResultPress(item)}
    />
  ), [handleResultPress])

  const renderEmpty = () => {
    if (isLoading) return null

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="error">{error}</Text>
        </View>
      )
    }

    if (query && results.length === 0) {
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

    return (
      <View style={styles.emptyContainer}>
        <Text variant="body" color="textMuted" style={styles.emptyText}>
          {searchType === 'image'
            ? 'Upload an image to search for matching profiles'
            : 'Enter a name or keyword to search'}
        </Text>
      </View>
    )
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <SearchTypeSelector
        selectedType={searchType}
        onTypeChange={handleTypeChange}
      />

      {searchType === 'image' ? (
        <ImageUploader
          onImageSelected={handleImageSelected}
          isLoading={isLoading}
        />
      ) : (
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSearch={handleSearch}
          placeholder={searchType === 'name' ? 'Search by name...' : 'Search by keyword...'}
        />
      )}

      <LocationFilter
        value={location}
        onChangeText={setLocation}
      />

      {searchType === 'name' && query && results.length > 0 && (
        <SaveAlertButton
          name={query}
          location={location || undefined}
          onSave={handleSaveAlert}
          atLimit={!canCreateMore}
        />
      )}
    </View>
  )

  const renderFooter = () => {
    if (!hasMore) return null

    return (
      <View style={styles.footer}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : null}
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
