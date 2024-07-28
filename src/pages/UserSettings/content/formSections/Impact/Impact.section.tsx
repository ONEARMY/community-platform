import React from 'react'
import { IMPACT_YEARS } from 'src/pages/User/impact/constants'
import { fields } from 'src/pages/UserSettings/labels'
import { Box, Heading, Text } from 'theme-ui'

import { FlexSectionContainer } from '../elements'
import { ImpactYearSection } from './ImpactYear.section'

export const ImpactSection = () => {
  const { description, title } = fields.impact

  return (
    <FlexSectionContainer>
      <Heading as="h2" variant="small">
        {title}
      </Heading>
      <Text mt={4} mb={4}>
        {description}
      </Text>
      <Box>
        {IMPACT_YEARS.map((year) => {
          return <ImpactYearSection year={year} key={year} />
        })}
      </Box>
    </FlexSectionContainer>
  )
}
