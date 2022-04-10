import * as React from 'react'
import { useHistory } from 'react-router'
import Text from 'src/components/Text'
import { Button } from 'oa-components'
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
  const { votedUsefulCount, userVotedUseful } = props
  // Map state to props only for first render
  const [state, setState] = React.useState({
    votedUsefulCount,
    userVotedUseful,
  })
  // Optimistically update the value (that would otherwise be passesd by props)
  // We avoid useEffect or any other props-based re-renders to allow optimistic value to take precedence after
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
        onClick={
          props.isLoggedIn ? handleUsefulClick : () => history.push('/sign-in')
        }
        ml="8px"
        sx={{ fontSize: '14px' }}
        backgroundColor={theme.colors.softyellow}
        icon={state.userVotedUseful ? 'star-active' : 'star'}
      >
        <Text ml={1}>Useful {state.votedUsefulCount}</Text>
      </Button>
      {!props.isLoggedIn && <Tooltip />}
    </>
  )
}
