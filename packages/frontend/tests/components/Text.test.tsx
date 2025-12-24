import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { Text } from '../../src/components/Text'
import { colors } from '../../src/theme/colors'

describe('Text Component', () => {
  it('renders children correctly', () => {
    render(<Text>Hello World</Text>)
    expect(screen.getByText('Hello World')).toBeTruthy()
  })

  it('applies default body variant styles', () => {
    render(<Text testID="text">Default text</Text>)
    const textElement = screen.getByTestId('text')
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: 16 }),
      ])
    )
  })

  it('applies h1 variant styles', () => {
    render(<Text variant="h1" testID="text">Heading</Text>)
    const textElement = screen.getByTestId('text')
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: 32, fontWeight: 'bold' }),
      ])
    )
  })

  it('applies custom color', () => {
    render(<Text color="primary" testID="text">Colored text</Text>)
    const textElement = screen.getByTestId('text')
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: colors.primary }),
      ])
    )
  })

  it('merges custom styles', () => {
    render(
      <Text style={{ marginTop: 10 }} testID="text">
        Styled text
      </Text>
    )
    const textElement = screen.getByTestId('text')
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ marginTop: 10 }),
      ])
    )
  })
})
