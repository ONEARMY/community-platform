import { format, formatDistanceToNow } from 'date-fns'
import { Text } from 'theme-ui'

type DateType = string | number | Date

export interface IProps {
  createdAt: DateType
  action?: string
  showLabel?: boolean
  modifiedAt?: DateType | null
}

const formatDateTime = (date: DateType): string => {
  return format(new Date(date), 'dd-MM-yyyy HH:mm')
}

const relativeDateFormat = (date: DateType): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const DisplayDate = (props: IProps) => {
  const {
    createdAt,
    modifiedAt,
    action = 'Published',
    showLabel = true,
  } = props

  const formattedDate = formatDateTime(modifiedAt || createdAt)
  const relativeDate = relativeDateFormat(modifiedAt || createdAt)
  const label = modifiedAt && createdAt !== modifiedAt ? 'Updated ' : action

  return (
    <Text title={formattedDate}>
      {showLabel && label} {relativeDate}
    </Text>
  )
}
