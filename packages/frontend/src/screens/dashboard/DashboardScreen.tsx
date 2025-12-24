import React, { useCallback } from 'react'
import { View, ScrollView, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Text } from '../../components/Text'
import {
  WelcomeCard,
  ActivityFeed,
  AlertsPreview,
  QuickActions,
  StatsCard,
} from '../../components/dashboard'
import { useDashboard } from '../../hooks/useDashboard'
import { colors } from '../../theme/colors'
import type { AppStackParamList } from '../../navigation/AppNavigator'

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>

export function DashboardScreen({ navigation }: Props) {
  const {
    data,
    isLoading,
    error,
    refresh,
    loadMoreActivity,
    isLoadingMore,
  } = useDashboard()

  const handleViewAlerts = useCallback(() => {
    // TODO: Navigate to alerts screen when implemented
  }, [])

  const handlePostPress = useCallback((postId: number) => {
    // TODO: Navigate to post detail screen when implemented
  }, [])

  if (isLoading && !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="body" color="textSecondary" style={styles.loadingText}>
          Loading your dashboard...
        </Text>
      </View>
    )
  }

  if (error && !data) {
    return (
      <View style={styles.centered}>
        <Text variant="h3" color="text">
          Something went wrong
        </Text>
        <Text variant="body" color="textSecondary" style={styles.errorText}>
          We couldn't load your dashboard. Pull down to try again.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refresh}
          tintColor={colors.primary}
        />
      }
    >
      {data && (
        <>
          <WelcomeCard welcome={data.welcome} />

          <QuickActions
            navigation={navigation}
            isVerified={data.welcome.isVerified}
          />

          <StatsCard stats={data.stats} />

          <AlertsPreview
            alerts={data.alerts}
            onViewAll={handleViewAlerts}
          />

          <ActivityFeed
            items={data.activity}
            hasMore={data.hasMore}
            isLoading={isLoadingMore}
            onLoadMore={loadMoreActivity}
            onPostPress={handlePostPress}
          />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
})
