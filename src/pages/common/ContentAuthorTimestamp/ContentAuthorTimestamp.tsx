import { DisplayDate } from 'oa-components'
import { Box, Text } from 'theme-ui'

import { UserNameTag } from '../UserNameTag/UserNameTag'

interface ContentAuthorTimestampProps {
  userName: string
  countryCode: string | undefined
  created: string | number | Date
  modified?: string | number | Date
  action?: string
}

export const ContentAuthorTimestamp = ({
  userName,
  countryCode,
  created,
  modified,
  action,
}: ContentAuthorTimestampProps) => {
  return (
    <Box>
      <UserNameTag
        userName={userName}
        countryCode={countryCode}
        created={created}
        action={action}
      />
      <Text
        hidden={created === modified || !modified}
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
        Last update <DisplayDate date={modified} />
      </Text>
    </Box>
  )
}
