import { observer } from 'mobx-react-lite'

import { useCommonStores } from '../../common/hooks/useCommonStores'
import { AlertIncompleteProfile } from './AlertIncompleteProfile'
import { AlertProfileVerification } from './AlertProfileVerification'

export const Alerts = observer(() => {
  const { userStore } = useCommonStores().stores
  const authUser = userStore.authUser

  if (!authUser) return null

  return (
    <>
      <AlertProfileVerification />
      <AlertIncompleteProfile />
    </>
  )
})
