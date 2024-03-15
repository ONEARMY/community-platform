import { Link } from 'react-router-dom'
import { Button } from 'oa-components'
import { Text } from 'theme-ui'

import { BreadcrumbsTooltip } from './BreadcrumbsTooltip'

interface BreadcrumbItemProps {
  text: string
  link?: string
  isLast: boolean
  collapse: boolean
}

export const BreadcrumbItem = ({
  text,
  link,
  isLast,
  collapse,
}: BreadcrumbItemProps) => (
  <li style={{ display: 'inline', marginRight: '10px' }}>
    {!isLast ? (
      collapse ? (
        <BreadcrumbsTooltip text={text}>
          <Link to={link || ''}>
            <Button
              sx={{ color: 'dimgray', fontSize: 15 }}
              variant="breadcrumb"
            >
              {'...'}
            </Button>
          </Link>
        </BreadcrumbsTooltip>
      ) : (
        <Link to={link || ''}>
          <Button sx={{ color: 'dimgray', fontSize: 15 }} variant="breadcrumb">
            {text}
          </Button>
        </Link>
      )
    ) : (
      <Text sx={{ color: 'black', fontSize: 15 }}>{text}</Text>
    )}
  </li>
)
