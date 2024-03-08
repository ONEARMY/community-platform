import { Text } from 'theme-ui'

import { BreadcrumbItem } from './BreadcrumbsItem'

interface BreadcrumbsProps {
  steps: Array<{ text: string; link?: string } | null>
}

const Chevron = () => {
  return (
    <Text sx={{ fontFamily: 'monospace', fontSize: 20, color: 'dimgray' }}>
      {'>'}
    </Text>
  )
}

export const Breadcrumbs = ({ steps }: BreadcrumbsProps) => {
  return (
    <ul style={{ margin: 20, padding: 0 }}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          step && (
            <>
              <BreadcrumbItem
                key={index}
                text={step.text}
                link={step.link}
                isLast={isLast}
              />
              {!isLast && <Chevron />}
            </>
          )
        )
      })}
    </ul>
  )
}
