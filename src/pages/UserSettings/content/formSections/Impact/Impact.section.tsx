import { useState } from 'react'
import { Heading, Box, Button, Text } from 'theme-ui'

import { buttons, fields } from 'src/pages/UserSettings/labels'
import { IMPACT_YEARS } from 'src/pages/User/impact/constants'
import { FlexSectionContainer } from '../elements'
import { ImpactYearSection } from './ImpactYear.section'

export const ImpactSection = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const { description, title } = fields.impact
  const { expandClose, expandOpen } = buttons.impact

  const buttonLabel = isExpanded ? expandClose : expandOpen

  return (
    <FlexSectionContainer>
      <Heading dangerouslySetInnerHTML={{ __html: title }} variant="small" />
      <Text mt={4} mb={4}>
        {description}
      </Text>
      {isExpanded && (
        <Box>
          {IMPACT_YEARS.map((year) => {
            return <ImpactYearSection year={year} key={year} />
          })}
        </Box>
      )}
      <Box mt={2}>
        <Button
          dangerouslySetInnerHTML={{ __html: buttonLabel }}
          data-cy="impact-button-expand"
          onClick={() => setIsExpanded(!isExpanded)}
          variant="secondary"
        />
      </Box>
    </FlexSectionContainer>
  )
}
