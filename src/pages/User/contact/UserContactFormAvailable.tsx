import { Alert, Flex, Text } from 'theme-ui'

interface IProps {
  isUserProfileContactable: boolean
}

export const UserContactFormAvailable = ({
  isUserProfileContactable,
}: IProps) => {
  return (
    <Alert variant="info">
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        {isUserProfileContactable ? (
          <Text sx={{ textAlign: 'left' }}>
            Other users are able to contact you
          </Text>
        ) : (
          <Text sx={{ textAlign: 'left' }}>
            Other users are not able to contact you
          </Text>
        )}
        <Text sx={{ textAlign: 'left' }}>
          You can change that by editing your profile
        </Text>
      </Flex>
    </Alert>
  )
}
