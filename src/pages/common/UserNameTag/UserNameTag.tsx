import { DisplayDate, Username } from 'oa-components'
import { Flex, Text } from 'theme-ui'

interface IProps {
  userName: string
  countryCode: string | undefined
  createdAt?: string | number | Date
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

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Username
            user={{
              userName,
              countryCode,
            }}
            sx={{ position: 'relative' }}
          />
          {createdAt && (
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
              />
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
