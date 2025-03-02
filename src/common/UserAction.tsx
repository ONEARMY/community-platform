import { useContext } from 'react'
import { SessionContext } from 'src/pages/common/SessionContext'

interface IProps {
  loggedIn: React.ReactNode
  loggedOut: React.ReactNode | null
}

type IUserVerificationConditions = 'loggedIn' | 'loggedOut'

export const UserAction = (props: IProps) => {
  const session = useContext(SessionContext)
  const { loggedIn, loggedOut } = props

  const userCondition: IUserVerificationConditions = session?.id
    ? 'loggedIn'
    : 'loggedOut'

  switch (userCondition) {
    case 'loggedIn':
      return loggedIn
    default:
      return loggedOut
  }
}
