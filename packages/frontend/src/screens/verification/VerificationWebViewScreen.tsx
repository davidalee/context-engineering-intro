import React, { useState, useCallback, useRef } from 'react'
import { View, StyleSheet, ActivityIndicator, Alert, BackHandler } from 'react-native'
import { WebView, type WebViewNavigation } from 'react-native-webview'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useFocusEffect } from '@react-navigation/native'
import { Text } from '../../components/Text'
import { colors } from '../../theme/colors'
import type { AppStackParamList } from '../../navigation/AppNavigator'

type Props = NativeStackScreenProps<AppStackParamList, 'VerificationWebView'>

export function VerificationWebViewScreen({ navigation, route }: Props) {
  const { verificationUrl, sessionId } = route.params
  const [isLoading, setIsLoading] = useState(true)
  const webViewRef = useRef<WebView>(null)

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Cancel Verification?',
          'Are you sure you want to cancel? You can resume verification later.',
          [
            { text: 'Continue', style: 'cancel' },
            {
              text: 'Cancel',
              style: 'destructive',
              onPress: () => navigation.goBack(),
            },
          ]
        )
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [navigation])
  )

  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    const { url } = navState

    if (url.includes('/api/webhooks/didit') || url.includes('verification/complete')) {
      navigation.replace('VerificationComplete', { sessionId })
    }
  }, [navigation, sessionId])

  const handleError = useCallback(() => {
    Alert.alert(
      'Connection Error',
      'Unable to load verification. Please check your internet connection and try again.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    )
  }, [navigation])

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="body" color="textSecondary" style={styles.loadingText}>
            Loading verification...
          </Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: verificationUrl }}
        onLoadEnd={() => setIsLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        style={styles.webview}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
  },
  webview: {
    flex: 1,
  },
})
