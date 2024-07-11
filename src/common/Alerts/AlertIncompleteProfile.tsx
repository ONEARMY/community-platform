import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Alert, Flex } from 'theme-ui'

/**
 * A simple notification banner component that reminds users to fill profile details
 */
export const AlertIncompleteProfile = observer(() => {
  const { userStore } = useCommonStores().stores
  const activeUser = userStore.activeUser
  if (!activeUser) return null
  const isProfileFilled =
    activeUser.about &&
    activeUser.displayName &&
    activeUser.coverImages.length !== 0 &&
    activeUser.links?.length !== 0
  if (isProfileFilled) return null
  return (
    <Link to="/settings">
      <Flex data-cy="incompleteProfileBanner">
        <Alert
          variant="failure"
          sx={{
            alignItems: 'center',
            flex: '1',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: 2,
            fontWeight: 'normal',
          }}
        >
          Fill in your profile details before posting
        </Alert>
      </Flex>
    </Link>
  )
})
