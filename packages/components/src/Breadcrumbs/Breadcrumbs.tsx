import { Box } from 'theme-ui'

import { Icon } from '../Icon/Icon'
import { BreadcrumbItem } from './BreadcrumbsItem'

const BREADCRUMBS_ITEM_LABEL_MAX_LENGTH = 38

type step = { text: string; link?: string } | null
export interface BreadcrumbsProps {
  steps: Array<step>
}

const calculateBreadcrumbsLength = (steps: Array<step>) => {
  const titles_length = steps.reduce((accumulator, step) => {
    return accumulator + (step ? step.text.length : 0)
  }, 0)
  const chevrons_length = (steps.length - 1) * 3
  return titles_length + chevrons_length
}

export const Breadcrumbs = ({ steps }: BreadcrumbsProps) => {
  const total_length = calculateBreadcrumbsLength(steps)
  return (
    <Box style={{ marginLeft: 0, marginTop: 30, marginBottom: 20, padding: 0 }}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isExtreme = isLast || index == 0
        return (
          step && (
            <>
              <BreadcrumbItem
                key={index}
                text={step.text}
                link={step.link}
                isLast={isLast}
                collapse={
                  total_length > BREADCRUMBS_ITEM_LABEL_MAX_LENGTH && !isExtreme
                }
              />
              {!isLast && (
                <Icon
                  glyph={'chevron-right'}
                  color={'black'}
                  marginRight={'10px'}
                />
              )}
            </>
          )
        )
      })}
    </Box>
  )
}
