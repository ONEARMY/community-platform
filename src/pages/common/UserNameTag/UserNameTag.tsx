import { format } from 'date-fns'
import { Text, Flex } from 'theme-ui'
import { Username } from 'oa-components'
import { isUserVerified } from 'src/common/isUserVerified'

interface UserNameTagProps {
  userName: string
  countryCode: string | undefined
  created: string | number | Date
  action?: string
}

export const UserNameTag = ({
  userName,
  countryCode,
  created,
  action = 'Published',
}: UserNameTagProps) => {
  const dateText = `| ${action} on ${format(new Date(created), 'DD-MM-YYYY')}`
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Username
            user={{
              userName: userName,
              countryCode: countryCode,
            }}
            isVerified={isUserVerified(userName)}
          />
          <Text
            variant="auxiliary"
            sx={{
              marginTop: 2,
              marginBottom: 2,
            }}
          >
            {dateText}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
