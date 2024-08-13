import { Username } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { formatDate } from 'src/utils/date'
import { Flex, Text } from 'theme-ui'

interface UserNameTagProps {
  userName: string
  countryCode: string | undefined
  date: string | number | Date
  action?: string
}

export const UserNameTag = ({
  userName,
  countryCode,
  date,
  action = 'Published',
}: UserNameTagProps) => {
  const { aggregationsStore } = useCommonStores().stores
  const dateText = `| ${action} on ${formatDate(new Date(date))}`
  const isVerified = aggregationsStore.isVerified(userName)

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
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
  )
}
