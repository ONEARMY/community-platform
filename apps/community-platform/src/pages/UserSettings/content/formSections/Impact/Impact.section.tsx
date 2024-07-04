import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Button, Heading, Image, Text } from 'theme-ui'

import IconArrowDown from '../../../../../assets/icons/icon-arrow-down.svg'
import IconArrowUp from '../../../../../assets/icons/icon-arrow-up.svg'
import { IMPACT_YEARS } from '../../../../../pages/User/impact/constants'
import { buttons, fields } from '../../../../../pages/UserSettings/labels'
import { FlexSectionContainer } from '../elements'
import { ImpactYearSection } from './ImpactYear.section'

export const ImpactSection = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>()
  const { description, title } = fields.impact
  const { expandClose, expandOpen } = buttons.impact

  const buttonLabel = isExpanded ? expandClose : expandOpen
  const buttonIcon = isExpanded ? IconArrowUp : IconArrowDown

  const { hash } = useLocation()

  useEffect(() => {
    if (hash.includes('#impact_')) {
      const impactyear = Number(hash.slice(8))
      const impactYearsConstants: number[] = IMPACT_YEARS.map((elem) =>
        Number(elem),
      )
      if (impactYearsConstants.includes(impactyear)) {
        setIsExpanded(true)
      }
    }
  }, [hash])

  return (
    <FlexSectionContainer>
      <Heading as="h2" variant="small">
        {title}
      </Heading>
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
