import React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from '../screens/HomeScreen'
import {
  LoginScreen,
  SignUpScreen,
  MagicLinkScreen,
  MFAEnrollScreen,
  MFAVerifyScreen,
} from '../screens/auth'
import { useAuth } from '../contexts/AuthContext'
import { colors } from '../theme/colors'

export type AuthStackParamList = {
  Login: undefined
  SignUp: undefined
  MagicLink: undefined
  MFAVerify: { factorId: string }
}

export type AppStackParamList = {
  Home: undefined
  MFAEnroll: undefined
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
        name="Home"
        component={HomeScreen}
        options={{ title: 'BetweenUs' }}
      />
      <AppStack.Screen
        name="MFAEnroll"
        component={MFAEnrollScreen}
        options={{ title: 'Set Up 2FA' }}
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
