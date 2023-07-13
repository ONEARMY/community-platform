import { Text } from 'theme-ui'

export interface ICharacterCountProps {
  currentSize: number
  minSize: number
  maxSize: number
}

export const CharacterCount = ({
  currentSize,
  minSize,
  maxSize,
}: ICharacterCountProps) => {
  const percentageOfMax = currentSize / maxSize
  const characterCountThresholds = [
    { value: 1.0, color: 'red', font_weight: 'bold' },
    { value: 0.95, color: 'subscribed', font_weight: 'bold' },
    { value: 0.9, color: 'green', font_weight: 'bold' },
  ]

  let color =
    characterCountThresholds.find(
      (threshold) => threshold.value <= percentageOfMax,
    )?.color ?? 'green'

  let fontWeight =
    characterCountThresholds.find(
      (threshold) => threshold.value <= percentageOfMax,
    )?.font_weight ?? 'normal'

  if (currentSize < minSize) {
    color = characterCountThresholds[0].color
    fontWeight = 'bold'
  }

  return (
    <Text
      data-cy="character-count"
      color={color}
      ml="auto"
      sx={{ fontSize: 1, margin: 1, fontWeight: fontWeight }}
    >
      {currentSize} / {maxSize}
    </Text>
  )
}
