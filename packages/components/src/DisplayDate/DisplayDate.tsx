import { format, formatDistanceToNow } from 'date-fns'
import { Text } from 'theme-ui'

type DateType = string | number | Date

export interface DisplayDateProps {
  date?: DateType
}

const formatDateTime = (date: DateType | undefined) => {
  if (!date) {
    return ''
  }

  return format(new Date(date), 'dd-MM-yyyy HH:mm')
}

const relativeDateFormat = (d: DateType | undefined): string => {
  if (!d) {
    return ''
  }
  return formatDistanceToNow(new Date(d), { addSuffix: true })
}

export const DisplayDate = ({ date }: DisplayDateProps) => {
  console.log(date)
  const formattedDate = formatDateTime(date)
  const relativeDate = relativeDateFormat(date)

  return <Text title={formattedDate}>{relativeDate}</Text>
}
