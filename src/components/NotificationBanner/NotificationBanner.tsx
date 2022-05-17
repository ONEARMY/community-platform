import { Flex, Text } from 'theme-ui'
import theme from 'src/themes/styled.theme'
import { Link } from 'src/components/Links'
import { observer } from 'mobx-react-lite'
import { useCommonStores } from 'src'

/**
 * A simple notification banner component that reminds users to fill profile details
 */
const NotificationBanner = observer(() => {
  const { userStore } = useCommonStores().stores
  const activeUser = userStore.activeUser
  if (!activeUser) return null
  const isProfileFilled =
    activeUser.about &&
    activeUser.displayName &&
    activeUser.coverImages.length !== 0 &&
    activeUser.links.length !== 0
  if (isProfileFilled) return null
  return (
    <Link to="/settings">
      <Flex
        data-cy="notificationBanner"
        bg={theme.colors.red2}
        py={2}
        px={1}
        style={{ alignItems: 'center', zIndex: 3001 }}
      >
        <Text
          color={'white'}
          sx={{ flex: '1', textAlign: 'center', fontSize: 2 }}
        >
          Fill in your profile details before posting
        </Text>
      </Flex>
    </Link>
  )
})

export default NotificationBanner
