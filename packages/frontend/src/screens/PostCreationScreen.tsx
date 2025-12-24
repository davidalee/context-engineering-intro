import React, { useCallback } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { PostForm } from '../components/posts/PostForm'
import { colors } from '../theme/colors'
import type { AppStackParamList } from '../navigation/AppNavigator'

type PostCreationScreenProps = NativeStackScreenProps<AppStackParamList, 'PostCreation'>

export function PostCreationScreen({ navigation }: PostCreationScreenProps) {
  const handleSuccess = useCallback(() => {
    navigation.navigate('Home')
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <PostForm onSuccess={handleSuccess} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
})
