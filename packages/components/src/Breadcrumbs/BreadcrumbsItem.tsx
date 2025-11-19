import { Link } from 'react-router'
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
      <Button type="button" variant="breadcrumb">
        {text}
      </Button>
    </Link>
  ) : (
    <Button type="button" variant="breadcrumb">
      {text}
    </Button>
  )
}

export const BreadcrumbItem = ({ text, link, isLast }: BreadcrumbItemProps) => (
  <Box
    style={{
      display: 'inline-flex',
      marginRight: '3px',
      ...(isLast && {
        flex: '1',
        minWidth: 0,
        maxWidth: '100%',
      }),
    }}
    data-testid="breadcrumbsItem"
    data-cy="breadcrumbsItem"
  >
    {!isLast ? (
      <BreadcrumbButton link={link} text={text} />
    ) : (
      <Text
        sx={{
          display: 'block',
          color: 'black',
          fontSize: [2, 3],
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {text}
      </Text>
    )}
  </Box>
)
