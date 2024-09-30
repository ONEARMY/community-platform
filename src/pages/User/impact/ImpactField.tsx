import { impactQuestions } from 'src/pages/UserSettings/content/impactQuestions'
import { numberWithCommas } from 'src/utils/helpers'
import { Box, Text } from 'theme-ui'

import { ImpactIcon } from './ImpactIcon'

import type { IImpactDataField } from 'oa-shared'

interface Props {
  field: IImpactDataField
}

export const ImpactField = ({ field }: Props) => {
  const { id, isVisible, value } = field

  const impactQuestion = impactQuestions.find((question) => question.id === id)
  if (!impactQuestion || !isVisible) return null

  const sx = {
    backgroundColor: 'background',
    borderRadius: 1,
    padding: 1,
    mt: 2,
  }

  const prefix = impactQuestion?.prefix || ''
  const suffix = impactQuestion?.suffix || ''
  const label = impactQuestion.label
  const text = `${prefix} ${numberWithCommas(value)} ${suffix} ${label}`

  return (
    <Box sx={sx}>
      <Text variant="label">
        <ImpactIcon id={id} /> {text}
      </Text>
    </Box>
  )
}
