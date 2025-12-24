import React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen, PostCreationScreen, DashboardScreen } from '../screens'
import {
  LoginScreen,
  SignUpScreen,
  MagicLinkScreen,
  MFAEnrollScreen,
  MFAVerifyScreen,
} from '../screens/auth'
import {
  VerificationIntroScreen,
  VerificationWebViewScreen,
  VerificationCompleteScreen,
} from '../screens/verification'
import {
  SearchScreen,
  SearchResultsScreen,
  AlertsManageScreen,
} from '../screens/search'
import type { SearchType } from '@betweenus/shared'
import { useAuth } from '../contexts/AuthContext'
import { colors } from '../theme/colors'

export type AuthStackParamList = {
  Login: undefined
  SignUp: undefined
  MagicLink: undefined
  MFAVerify: { factorId: string }
}

export type AppStackParamList = {
  Dashboard: undefined
  Home: undefined
  MFAEnroll: undefined
  PostCreation: undefined
  VerificationIntro: undefined
  VerificationWebView: { verificationUrl: string; sessionId: string }
  VerificationComplete: { sessionId: string }
  Search: undefined
  SearchResults: { type: SearchType; query: string; location?: string }
  AlertsManage: undefined
}

const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const AppStack = createNativeStackNavigator<AppStackParamList>()

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="MagicLink" component={MagicLinkScreen} />
      <AuthStack.Screen name="MFAVerify" component={MFAVerifyScreen} />
    </AuthStack.Navigator>
  )
}

function MainNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <AppStack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'BetweenUs' }}
      />
      <AppStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'BetweenUs' }}
      />
      <AppStack.Screen
        name="MFAEnroll"
        component={MFAEnrollScreen}
        options={{ title: 'Set Up 2FA' }}
      />
      <AppStack.Screen
        name="PostCreation"
        component={PostCreationScreen}
        options={{ title: 'Share Experience' }}
      />
      <AppStack.Screen
        name="VerificationIntro"
        component={VerificationIntroScreen}
        options={{ title: 'Identity Verification' }}
      />
      <AppStack.Screen
        name="VerificationWebView"
        component={VerificationWebViewScreen}
        options={{ title: 'Verify Your Identity', headerBackVisible: false }}
      />
      <AppStack.Screen
        name="VerificationComplete"
        component={VerificationCompleteScreen}
        options={{ title: 'Verification Status', headerBackVisible: false }}
      />
      <AppStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <AppStack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ title: 'Search Results' }}
      />
      <AppStack.Screen
        name="AlertsManage"
        component={AlertsManageScreen}
        options={{ title: 'Saved Alerts' }}
      />
    </AppStack.Navigator>
  )
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}

export function AppNavigator() {
  const { isLoading, isLoggedIn } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
})
