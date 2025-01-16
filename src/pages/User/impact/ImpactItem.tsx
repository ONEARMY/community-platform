import { sortImpactYearDisplayFields } from 'src/pages/UserSettings/utils'
import { Box, Flex, Heading } from 'theme-ui'

import { ImpactField } from './ImpactField'
import { ImpactMissing } from './ImpactMissing'

import type { IImpactYear, IImpactYearFieldList, IUser } from 'oa-shared'

interface Props {
  year: IImpactYear
  fields: IImpactYearFieldList | undefined
  user: IUser | undefined
}

export const ImpactItem = ({ fields, user, year }: Props) => {
  const outterBox = {
    flexBasis: ['100%', '100%', '50%'],
    padding: 2,
  }

  const innerBox = {
    backgroundColor: 'white',
    borderRadius: 1,
    height: '100%',
    padding: 2,
  }

  const sortedFields = sortImpactYearDisplayFields(fields)
  const visibleFields = sortedFields?.filter((field) => field.isVisible)

  return (
    <Box sx={outterBox} cy-data={`ImpactItem-${year}`}>
      <Box sx={innerBox}>
        <Heading as="h3" variant="small">
          {year}
        </Heading>
        {visibleFields && visibleFields.length > 0 ? (
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            {visibleFields.map((field, index) => {
              return <ImpactField field={field} key={index} />
            })}
          </Flex>
        ) : (
          <ImpactMissing
            fields={fields}
            owner={user}
            visibleFields={visibleFields}
            year={year}
          />
        )}
      </Box>
    </Box>
  )
}
