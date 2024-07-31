import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isProfileComplete } from 'src/utils/isProfileComplete'
import { Alert, Flex } from 'theme-ui'

/**
 * A simple notification banner component that reminds users to fill profile details
 */
export const AlertIncompleteProfile = observer(() => {
  const { userStore } = useCommonStores().stores
  const activeUser = userStore.activeUser

  if (!activeUser || isProfileComplete(activeUser)) return null

  return (
    <Link to="/settings">
      <Flex data-cy="incompleteProfileBanner">
        <Alert
          variant="failure"
          sx={{
            borderRadius: 0,
            alignItems: 'center',
            flex: '1',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: 2,
            fontWeight: 'normal',
          }}
        >
          Please fill in your profile details before posting
        </Alert>
      </Flex>
    </Link>
  )
})
