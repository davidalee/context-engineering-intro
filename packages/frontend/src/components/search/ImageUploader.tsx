import React, { useState, useCallback } from 'react'
import { View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Text } from '../Text'
import { colors } from '../../theme/colors'

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void
  isLoading?: boolean
}

export function ImageUploader({ onImageSelected, isLoading = false }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const requestPermission = async (type: 'camera' | 'library'): Promise<boolean> => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      return status === 'granted'
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      return status === 'granted'
    }
  }

  const processImage = useCallback(async (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || !result.assets[0]) {
      return
    }

    const asset = result.assets[0]
    setSelectedImage(asset.uri)

    if (asset.base64) {
      onImageSelected(asset.base64)
    }
  }, [onImageSelected])

  const pickFromLibrary = async () => {
    const hasPermission = await requestPermission('library')
    if (!hasPermission) {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photo library to select an image.'
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    })

    await processImage(result)
  }

  const takePhoto = async () => {
    const hasPermission = await requestPermission('camera')
    if (!hasPermission) {
      Alert.alert(
        'Permission needed',
        'Please allow camera access to take a photo.'
      )
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    })

    await processImage(result)
  }

  const handleClear = () => {
    setSelectedImage(null)
  }

  if (selectedImage) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          disabled={isLoading}
        >
          <Text variant="caption" color="white">✕</Text>
        </TouchableOpacity>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text variant="body" color="white">Searching...</Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text variant="body" color="textSecondary" style={styles.label}>
        Upload an image to search
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickFromLibrary}>
          <Text variant="body" style={styles.buttonIcon}>🖼️</Text>
          <Text variant="body" color="primary">Choose from library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
          <Text variant="body" style={styles.buttonIcon}>📷</Text>
          <Text variant="body" color="primary">Take a photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: 16,
  },
  buttonIcon: {
    fontSize: 20,
  },
  previewContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
