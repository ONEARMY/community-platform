import { Link } from '@remix-run/react'
import { observer } from 'mobx-react-lite'
import { Banner } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isProfileComplete } from 'src/utils/isProfileComplete'
import { Flex } from 'theme-ui'

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
        <Banner variant="failure">
          Please fill in your profile details before posting
        </Banner>
      </Flex>
    </Link>
  )
})
