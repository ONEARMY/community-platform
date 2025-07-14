import { UserAction } from '../UserAction'
import { AlertIncompleteProfile } from './AlertIncompleteProfile'

export const Alerts = () => {
  return (
    <UserAction
      loggedIn={
        <>
          <AlertIncompleteProfile />
        </>
      }
      loggedOut={null}
    />
  )
}
