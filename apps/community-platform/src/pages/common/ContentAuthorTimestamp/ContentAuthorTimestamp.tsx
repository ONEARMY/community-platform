import { Box, Text } from 'theme-ui'

import { formatDate } from '../../../utils/date'
import { UserNameTag } from '../UserNameTag/UserNameTag'

interface ContentAuthorTimestampProps {
  userName: string
  countryCode: string | undefined
  created: string | number | Date
  modified: string | number | Date
  action?: string
}

export const ContentAuthorTimestamp = ({
  userName,
  countryCode,
  created,
  modified,
  action,
}: ContentAuthorTimestampProps) => {
  const contentModifiedDate = formatDate(new Date(modified))
  const creationDate = formatDate(new Date(created))
  const modifiedDateText =
    contentModifiedDate !== creationDate
      ? `Last update on ${contentModifiedDate}`
      : ''

  return (
    <Box>
      <UserNameTag
        userName={userName}
        countryCode={countryCode}
        created={created}
        action={action}
      />
      <Text
        hidden={!modifiedDateText}
        variant="auxiliary"
        sx={{
          color: 'lightgrey',
          '&!important': {
            color: 'lightgrey',
          },
        }}
        mt={1}
        mb={2}
      >
        {modifiedDateText}
      </Text>
    </Box>
  )
}
