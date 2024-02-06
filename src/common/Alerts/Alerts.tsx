import { observer } from 'mobx-react-lite'

import { useCommonStores } from '../..'
import { AlertIncompleteProfile } from './AlertIncompleteProfile'
import { AlertProfileVerification } from './AlertProfileVerification'

export const Alerts = observer(() => {
  const { userStore } = useCommonStores().stores
  const authUser = userStore.authUser

  if (!authUser) return null

  if (!authUser.emailVerified) return <AlertProfileVerification />

  return <AlertIncompleteProfile />
})
