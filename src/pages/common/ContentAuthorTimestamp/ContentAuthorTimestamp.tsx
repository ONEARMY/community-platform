import { format } from 'date-fns'
import { UserNameTag } from '../UserNameTag/UserNameTag'
import { Box, Text } from 'theme-ui'

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
  const contentModifiedDate = format(new Date(modified), 'DD-MM-YYYY')
  const creationDate = format(new Date(created), 'DD-MM-YYYY')
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
