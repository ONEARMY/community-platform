import { observer } from 'mobx-react-lite'
import { Banner, InternalLink } from 'oa-components'
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
    <InternalLink to="/settings">
      <Flex data-cy="incompleteProfileBanner">
        <Banner
          sx={{ backgroundColor: 'softblue', color: 'black', cursor: 'cursor' }}
        >
          Hey there! 👋 Please complete your profile before posting!
        </Banner>
      </Flex>
    </InternalLink>
  )
})
