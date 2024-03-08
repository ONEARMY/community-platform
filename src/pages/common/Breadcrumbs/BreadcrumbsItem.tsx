import { Link } from 'react-router-dom'
import { Button } from 'oa-components'
import { Text } from 'theme-ui'

interface BreadcrumbItemProps {
  text: string
  link?: string
  isLast: boolean
}

export const BreadcrumbItem = ({ text, link, isLast }: BreadcrumbItemProps) => (
  <li style={{ display: 'inline', margin: '0px 10px 0px 10px' }}>
    {!isLast ? (
      <Link to={link || ''}>
        <Button sx={{ color: 'dimgray', fontSize: 15 }} variant="breadcrumb">
          {text}
        </Button>
      </Link>
    ) : (
      <Text sx={{ color: 'black', fontSize: 15 }}>{text}</Text>
    )}
  </li>
)
