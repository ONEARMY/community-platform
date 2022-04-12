import Text from 'src/components/Text'
import { Flex } from 'theme-ui'
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
  const isProfileFilled =
    activeUser?.about &&
    activeUser.displayName &&
    activeUser.coverImages.length !== 0 &&
    activeUser.links.length !== 0
  return !isProfileFilled && activeUser ? (
    <Link to="/settings">
      <Flex
        data-cy="notificationBanner"
        bg={theme.colors.red2}
        py={2}
        px={1}
        style={{ alignItems: 'center', zIndex: 3001 }}
      >
        <Text color={'white'} medium txtcenter sx={{ flex: '1' }}>
          Fill in your profile details before posting
        </Text>
      </Flex>
    </Link>
  ) : null
})

export default NotificationBanner
