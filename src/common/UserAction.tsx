import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isProfileComplete } from 'src/utils/isProfileComplete'

interface IProps {
  incompleteProfile?: React.ReactNode | null
  loggedIn: React.ReactNode
  loggedOut: React.ReactNode | null
}

type IUserVerificationConditions =
  | 'incompleteProfile'
  | 'loggedIn'
  | 'loggedOut'

export const UserAction = observer((props: IProps) => {
  const { incompleteProfile, loggedIn, loggedOut } = props
  const { userStore } = useCommonStores().stores

  const activeUser = userStore.activeUser
  const isLoggedIn = !!activeUser
  const isUserProfileComplete = isLoggedIn && isProfileComplete(activeUser)

  const options: { [key in IUserVerificationConditions]: boolean } = {
    incompleteProfile: isLoggedIn && !isUserProfileComplete,
    loggedIn: isLoggedIn && isUserProfileComplete,
    loggedOut: !isLoggedIn,
  }
  const userCondition = Object.keys(options).find((option) => options[option])

  switch (userCondition) {
    case 'incompleteProfile':
      return incompleteProfile || loggedIn
    case 'loggedIn':
      return loggedIn
    default:
      return loggedOut
  }
})
