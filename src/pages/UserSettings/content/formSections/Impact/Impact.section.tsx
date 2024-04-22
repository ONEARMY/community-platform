import React, { useState } from 'react'
import IconArrowDown from 'src/assets/icons/icon-arrow-down.svg'
import IconArrowUp from 'src/assets/icons/icon-arrow-up.svg'
import { IMPACT_YEARS } from 'src/pages/User/impact/constants'
import { buttons, fields } from 'src/pages/UserSettings/labels'
import { Box, Button, Heading, Image, Text } from 'theme-ui'

import { FlexSectionContainer } from '../elements'
import { ImpactYearSection } from './ImpactYear.section'

interface Props {
  targetYear: number | null
}

export const ImpactSection = ({ targetYear }: Props) => {
  const targetExists = !targetYear ? false : true
  const [isExpanded, setIsExpanded] = useState<boolean>(targetExists)
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
            return (
              <ImpactYearSection year={year} key={year} target={targetYear} />
            )
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
