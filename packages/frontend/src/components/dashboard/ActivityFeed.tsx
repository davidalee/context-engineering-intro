import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Text } from '../Text'
import { colors } from '../../theme/colors'
import type { ActivityItem } from '@betweenus/shared'

interface ActivityFeedProps {
  items: ActivityItem[]
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  onPostPress: (postId: number) => void
}

function getActivityIcon(type: ActivityItem['type']): string {
  switch (type) {
    case 'post_published':
      return '📝'
    case 'comment_received':
      return '💬'
    case 'comment_on_followed':
      return '🔔'
    case 'alert_match':
      return '🔍'
    default:
      return '📌'
  }
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

function ActivityItemRow({
  item,
  onPress,
}: {
  item: ActivityItem
  onPress: () => void
}) {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text variant="body">{getActivityIcon(item.type)}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text variant="body" color="text" numberOfLines={1}>
          {item.title}
        </Text>
        <Text variant="caption" color="textSecondary" numberOfLines={2}>
          {item.preview}
        </Text>
        <Text variant="caption" color="textMuted" style={styles.timestamp}>
          {getRelativeTime(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export function ActivityFeed({
  items,
  hasMore,
  isLoading,
  onLoadMore,
  onPostPress,
}: ActivityFeedProps) {
  if (items.length === 0 && !isLoading) {
    return (
      <View style={styles.container}>
        <Text variant="h3" color="text" style={styles.title}>
          Recent Activity
        </Text>
        <View style={styles.emptyContainer}>
          <Text variant="body" color="textSecondary" style={styles.emptyText}>
            Nothing new yet. Share an experience to get started.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text variant="h3" color="text" style={styles.title}>
        Recent Activity
      </Text>
      {items.map((item) => (
        <ActivityItemRow
          key={item.id}
          item={item}
          onPress={() => item.relatedPostId && onPostPress(item.relatedPostId)}
        />
      ))}
      {hasMore && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={onLoadMore}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text variant="body" color="primary">
              Load more
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  timestamp: {
    marginTop: 4,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  loadMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
})
