import { Box, Heading } from 'theme-ui'

import { ImpactField } from './ImpactField'
import { ImpactMissing } from './ImpactMissing'

import type { IImpactYearFieldList, IImpactYear, IUserPP } from 'src/models'

interface Props {
  year: IImpactYear
  fields: IImpactYearFieldList | undefined
  user: IUserPP
}

export const ImpactItem = ({ fields, user, year }: Props) => {
  const outterBox = {
    flexBasis: ['100%', '100%', '50%'],
    padding: 2,
  }

  const innerBox = {
    backgroundColor: 'background',
    borderRadius: 1,
    height: '100%',
    padding: 2,
  }

  const visibleFields = fields?.filter((field) => field.isVisible)

  return (
    <Box sx={outterBox} cy-data="ImpactItem">
      <Box sx={innerBox}>
        <Heading variant="small">{year}</Heading>
        {visibleFields ? (
          visibleFields.map((field, index) => {
            return <ImpactField field={field} key={index} />
          })
        ) : (
          <ImpactMissing year={year} user={user} />
        )}
      </Box>
    </Box>
  )
}
