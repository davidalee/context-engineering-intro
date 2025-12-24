import React, { useCallback } from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { Alert as AlertType } from '@betweenus/shared'
import { Text } from '../../components/Text'
import { useAlerts } from '../../hooks/useAlerts'
import { colors } from '../../theme/colors'
import type { AppStackParamList } from '../../navigation/AppNavigator'

type Props = NativeStackScreenProps<AppStackParamList, 'AlertsManage'>

interface AlertCardProps {
  alert: AlertType
  onDelete: (id: number) => void
}

function AlertCard({ alert, onDelete }: AlertCardProps) {
  const formattedDate = new Date(alert.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const lastMatched = alert.lastMatchedAt
    ? new Date(alert.lastMatchedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Never'

  const handleDelete = () => {
    Alert.alert(
      'Remove Alert',
      `Are you sure you want to stop receiving notifications about "${alert.searchName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onDelete(alert.id),
        },
      ]
    )
  }

  return (
    <View style={styles.alertCard}>
      <View style={styles.alertContent}>
        <Text variant="h3" color="text" numberOfLines={1}>
          {alert.searchName}
        </Text>
        {alert.location && (
          <Text variant="caption" color="textMuted">
            📍 {alert.location}
          </Text>
        )}
        <View style={styles.alertMeta}>
          <Text variant="caption" color="textMuted">
            Created: {formattedDate}
          </Text>
          <Text variant="caption" color="textMuted">
            Last match: {lastMatched}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text variant="body" color="error">🗑️</Text>
      </TouchableOpacity>
    </View>
  )
}

export function AlertsManageScreen({ navigation }: Props) {
  const { alerts, isLoading, error, limit, current, deleteAlert, fetchAlerts } = useAlerts()

  const handleDelete = useCallback(async (alertId: number) => {
    await deleteAlert(alertId)
  }, [deleteAlert])

  const renderAlert = useCallback(({ item }: { item: AlertType }) => (
    <AlertCard alert={item} onDelete={handleDelete} />
  ), [handleDelete])

  const renderHeader = () => (
    <View style={styles.header}>
      <Text variant="h3" color="text">Saved Alerts</Text>
      <View style={styles.limitBadge}>
        <Text variant="caption" color="textSecondary">
          {current} of {limit} alerts used
        </Text>
      </View>
    </View>
  )

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="error">{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAlerts}>
            <Text variant="body" color="primary">Retry</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={styles.emptyContainer}>
        <Text variant="h3" color="textSecondary" style={styles.emptyTitle}>
          No alerts saved yet
        </Text>
        <Text variant="body" color="textMuted" style={styles.emptyText}>
          When you search for a name, you can save it as an alert to be notified when someone shares an experience about them.
        </Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text variant="body" color="white">Go to Search</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAlert}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  limitBadge: {
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  deleteButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
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
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
})
