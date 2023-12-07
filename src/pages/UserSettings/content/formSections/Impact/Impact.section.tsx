import { useState } from 'react'
import { Heading, Box, Button, Image, Text } from 'theme-ui'

import IconArrowDown from 'src/assets/icons/icon-arrow-down.svg'
import IconArrowUp from 'src/assets/icons/icon-arrow-up.svg'
import { buttons, fields } from 'src/pages/UserSettings/labels'
import { IMPACT_YEARS } from 'src/pages/User/impact/constants'
import { FlexSectionContainer } from '../elements'
import { ImpactYearSection } from './ImpactYear.section'

export const ImpactSection = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const { description, title } = fields.impact
  const { expandClose, expandOpen } = buttons.impact

  const buttonLabel = isExpanded ? expandClose : expandOpen
  const buttonIcon = isExpanded ? IconArrowUp : IconArrowDown

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
          data-cy="impact-button-expand"
          onClick={() => setIsExpanded(!isExpanded)}
          variant="secondary"
        >
          {buttonLabel}
          <Image
            loading="lazy"
            src={buttonIcon}
            sx={{ marginLeft: '10px', width: '12px' }}
          />
        </Button>
      </Box>
    </FlexSectionContainer>
  )
}
