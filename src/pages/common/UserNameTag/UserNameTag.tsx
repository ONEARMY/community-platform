import { format } from 'date-fns'
import { Username } from 'oa-components'
import { isUserVerifiedWithStore } from 'src/common/isUserVerified'
import { useCommonStores } from 'src/index'
import { Flex, Text } from 'theme-ui'

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
  const { aggregationsStore } = useCommonStores().stores

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
            isVerified={isUserVerifiedWithStore(userName, aggregationsStore)}
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
