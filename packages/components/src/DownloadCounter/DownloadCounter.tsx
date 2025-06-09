import { Text } from 'theme-ui'

export interface IProps {
  total: number | undefined
}

// Duplicated util from main app - should be in 'shared' once the setup
// is right with typing and testing
const numberWithCommas = (number: number) => {
  return new Intl.NumberFormat('en-US').format(number)
}

export const DownloadCounter = ({ total }: IProps) => {
  if (!total) {
    return null
  }

  return (
    <Text
      data-cy="file-download-counter"
      sx={{
        fontSize: 1,
        color: 'grey',
      }}
    >
      {numberWithCommas(total || 0)}
      {total !== 1 ? ' downloads' : ' download'}
    </Text>
  )
}
