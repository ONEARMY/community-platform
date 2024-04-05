import { Link } from 'react-router-dom'
import { Button } from '../Button/Button'
import { Box, Text } from 'theme-ui'

import { BreadcrumbsTooltip } from './BreadcrumbsTooltip'

interface BreadcrumbButtonProps {
  text: string
  link?: string
}

interface BreadcrumbItemProps {
  text: string
  link?: string
  isLast: boolean
  collapse: boolean
}

const BreadcrumbButton = ({ text, link }: BreadcrumbButtonProps) => {
  return link ? (
    <Link to={link}>
      <Button variant="breadcrumb">{text}</Button>
    </Link>
  ) : (
    <Button variant="breadcrumb">{text}</Button>
  )
}

export const BreadcrumbItem = ({
  text,
  link,
  isLast,
  collapse,
}: BreadcrumbItemProps) => (
  <Box style={{ display: 'inline', marginRight: '10px' }}>
    {!isLast ? (
      collapse ? (
        <BreadcrumbsTooltip text={text}>
          <BreadcrumbButton link={link} text={'...'} />
        </BreadcrumbsTooltip>
      ) : (
        <BreadcrumbButton link={link} text={text} />
      )
    ) : (
      <Text sx={{ color: 'black', fontSize: 15 }}>{text}</Text>
    )}
  </Box>
)
