import { observer } from 'mobx-react-lite'

import { useCommonStores } from './hooks/useCommonStores'

interface IProps {
  loggedIn: React.ReactNode
  loggedOut: React.ReactNode | null
}

type IUserVerificationConditions = 'loggedIn' | 'loggedOut'

export const UserAction = observer((props: IProps) => {
  const { loggedIn, loggedOut } = props

  const { userStore } = useCommonStores().stores
  const authUser = userStore.authUser

  const userCondition: IUserVerificationConditions = authUser
    ? 'loggedIn'
    : 'loggedOut'

  switch (userCondition) {
    case 'loggedIn':
      return loggedIn
    default:
      return loggedOut
  }
})
