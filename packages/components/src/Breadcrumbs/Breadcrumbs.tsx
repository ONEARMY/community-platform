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
        marginLeft: 2,
        marginTop: [2, 4],
        marginBottom: [2, 4],
        padding: 0,
        alignItems: 'center',
      }}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <Box>
            <BreadcrumbItem text={step.text} link={step.link} isLast={isLast} />
            {!isLast && (
              <Icon
                glyph={'chevron-right'}
                color={'black'}
                marginRight={'10px'}
                data-testid="breadcrumbsChevron"
              />
            )}
          </Box>
        )
      })}
    </Flex>
  )
}
