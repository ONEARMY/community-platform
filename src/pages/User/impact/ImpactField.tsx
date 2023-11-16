import { Box, Text } from 'theme-ui'

import { numberWithCommas } from 'src/utils/helpers'
import { ImpactEmoji } from './ImpactEmoji'

import type { ImpactDataField } from 'src/models'

interface Props {
  field: ImpactDataField
}

export const ImpactField = ({ field }: Props) => {
  const { label, prefix, suffix, value } = field

  const sx = {
    backgroundColor: 'white',
    borderRadius: 1,
    padding: 1,
    mt: 2,
  }

  const text = `${prefix ? prefix : ''} ${numberWithCommas(value)} ${
    suffix ? suffix : ''
  } ${label}`

  return (
    <Box sx={sx}>
      <Text variant="label">
        <ImpactEmoji label={label} /> {text}
      </Text>
    </Box>
  )
}
