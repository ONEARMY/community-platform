import * as React from 'react'
import { useHistory } from 'react-router'
import Text from 'src/components/Text'
import { Button } from 'src/components/Button'
import Tooltip from 'src/components/Tooltip'
import theme from 'src/themes/styled.theme'

interface IProps {
  userVotedUseful: boolean
  votedUsefulCount: number
  isLoggedIn: boolean
  onUsefulClick: () => void
}
export const HowtoUsefulStats = (props: IProps) => {
  const history = useHistory()
  // when loading, we first want to use values passed from props to set the local state
  // we don't use these directly as we will want to update when the user toggles the useful vote button
  const [state, setState] = React.useState({
    votedUsefulCount: props.votedUsefulCount,
    userVotedUseful: props.userVotedUseful,
  })
  // when voting useful, update local display first before propogating changes to update db
  // this provides immediate feedback whilst waiting for the database to handle updates
  // (which go through triggered function as stats are linked to the users profile, so can be slow)
  const handleUsefulClick = () => {
    const usefulCounterChange = state.userVotedUseful ? -1 : 1
    setState({
      ...state,
      votedUsefulCount: state.votedUsefulCount + usefulCounterChange,
      userVotedUseful: !state.userVotedUseful,
    })
    props.onUsefulClick()
  }

  return (
    <>
      <Button
        data-cy="vote-useful"
        data-tip={props.isLoggedIn ? undefined : 'log in to use this'}
        variant="subtle"
        fontSize="14px"
        onClick={
          props.isLoggedIn ? handleUsefulClick : () => history.push('/sign-in')
        }
        ml="8px"
        backgroundColor={theme.colors.softyellow}
        icon={state.userVotedUseful ? 'star-active' : 'star'}
      >
        <Text ml={1}>Useful {state.votedUsefulCount}</Text>
      </Button>
      {!props.isLoggedIn && <Tooltip />}
    </>
  )
}
