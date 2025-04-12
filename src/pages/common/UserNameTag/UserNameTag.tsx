import { DisplayDate, Username } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Flex, Text } from 'theme-ui'

interface IProps {
  userName: string
  countryCode: string | undefined
  createdAt: string | number | Date
  action?: string
  modifiedAt?: string | number | Date | null
}

export const UserNameTag = (props: IProps) => {
  const {
    userName,
    countryCode,
    createdAt,
    action = 'Published',
    modifiedAt,
  } = props
  const { aggregationsStore } = useCommonStores().stores

  const isVerified = aggregationsStore.isVerified(userName)

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Username
            user={{
              userName,
              countryCode,
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
            |{' '}
            <DisplayDate
              action={action}
              createdAt={createdAt}
              modifiedAt={modifiedAt}
            ></DisplayDate>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
