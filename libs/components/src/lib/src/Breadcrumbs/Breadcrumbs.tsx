import { Box, Flex } from 'theme-ui'

import { Icon } from '../Icon/Icon'
import { BreadcrumbItem } from './BreadcrumbsItem'

type Step = { text: string; link?: string }
export interface BreadcrumbsProps {
  steps: Step[]
}

export const Breadcrumbs = ({ steps }: BreadcrumbsProps) => {
  return (
    <Flex
      sx={{
        marginLeft: -1,
        marginTop: [2, 2, 7],
        marginBottom: 2,
        padding: 0,
        alignItems: 'center',
      }}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <Box key={index}>
            <BreadcrumbItem text={step.text} link={step.link} isLast={isLast} />
            {!isLast && (
              <Icon
                glyph={'chevron-right'}
                color={'black'}
                marginRight={'8px'}
                data-testid="breadcrumbsChevron"
              />
            )}
          </Box>
        )
      })}
    </Flex>
  )
}
