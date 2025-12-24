import React from 'react'
import { View, StyleSheet } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { Text } from '../Text'
import { colors } from '../../theme/colors'

interface QRCodeDisplayProps {
  qrCode: string
}

export function QRCodeDisplay({ qrCode }: QRCodeDisplayProps) {
  const isDataUrl = qrCode.startsWith('data:image')
  const qrValue = isDataUrl ? extractQRValue(qrCode) : qrCode

  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <QRCode value={qrValue} size={200} backgroundColor={colors.white} />
      </View>
      <Text variant="caption" color="textMuted" style={styles.hint}>
        Scan with Google Authenticator or similar app
      </Text>
    </View>
  )
}

function extractQRValue(dataUrl: string): string {
  return dataUrl
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hint: {
    marginTop: 16,
    textAlign: 'center',
  },
})
