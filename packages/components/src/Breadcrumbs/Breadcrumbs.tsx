import { Box, Flex } from 'theme-ui'

import { Icon } from '../Icon/Icon'
import { BreadcrumbItem } from './BreadcrumbsItem'

type step = { text: string; link?: string } | null
export interface BreadcrumbsProps {
  steps: Array<step>
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
          step && (
            <>
              <BreadcrumbItem
                text={step.text}
                link={step.link}
                isLast={isLast}
              />
              {!isLast && (
                <Icon
                  glyph={'chevron-right'}
                  color={'black'}
                  marginRight={'10px'}
                  data-testid="breadcrumbsChevron"
                />
              )}
            </>
          )
        )
      })}
    </Flex>
  )
}
