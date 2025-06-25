import { UserAction } from '../UserAction'
import { AlertIncompleteProfile } from './AlertIncompleteProfile'
import { AlertProfileVerification } from './AlertProfileVerification'

export const Alerts = () => {
  return (
    <UserAction
      loggedIn={
        <>
          <AlertProfileVerification />
          <AlertIncompleteProfile />
        </>
      }
      loggedOut={null}
    />
  )
}
