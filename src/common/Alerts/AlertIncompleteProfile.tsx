import { observer } from 'mobx-react-lite'
import { Banner, InternalLink } from 'oa-components'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { isProfileComplete } from 'src/utils/isProfileComplete'
import { Flex } from 'theme-ui'

export const AlertIncompleteProfile = observer(() => {
  const { profile: activeUser } = useProfileStore()

  if (!activeUser || isProfileComplete(activeUser)) return null

  return (
    <InternalLink to="/settings">
      <Flex data-cy="incompleteProfileBanner">
        <Banner sx={{ backgroundColor: 'softblue', color: 'black' }}>
          Hey there! 👋 Please complete your profile before posting!
        </Banner>
      </Flex>
    </InternalLink>
  )
})
