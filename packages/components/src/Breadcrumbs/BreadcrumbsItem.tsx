import { Link } from 'react-router-dom'
import { Box, Text } from 'theme-ui'

import { Button } from '../Button/Button'

interface BreadcrumbButtonProps {
  text: string
  link?: string
}

interface BreadcrumbItemProps {
  text: string
  link?: string
  isLast: boolean
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

export const BreadcrumbItem = ({ text, link, isLast }: BreadcrumbItemProps) => (
  <Box
    style={{ display: 'inline', marginRight: '10px' }}
    data-testid="breadcrumbsItem"
  >
    {!isLast ? (
      <BreadcrumbButton link={link} text={text} />
    ) : (
      <Text
        sx={{
          display: 'block',
          color: 'black',
          fontSize: 15,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          width: [100, '100%'],
        }}
      >
        {text}
      </Text>
    )}
  </Box>
)
