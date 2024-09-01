import { Username } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { formatDate } from 'src/utils/date'
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

  const dateText = `| ${action} on ${formatDate(new Date(created))}`
  const isVerified = aggregationsStore.isVerified(userName)

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Username
            user={{
              userName: userName,
              countryCode: countryCode,
              isVerified,
            }}
            sx={{ position: 'relative' }}
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
