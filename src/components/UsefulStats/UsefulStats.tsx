import { useEffect, useState } from 'react'
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
export const UsefulStats = (props: IProps) => {
  const history = useHistory()

  const [votedUsefulCount, setVotedUsefulCount] = useState<number>()
  const [userVotedUseful, setUserVotedUseful] = useState<boolean>()

  useEffect(
    () => setUserVotedUseful(props.userVotedUseful),
    [props.userVotedUseful],
  )
  useEffect(
    () => setVotedUsefulCount(props.votedUsefulCount),
    [props.votedUsefulCount],
  )
  const handleUsefulClick = () => {
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
        icon={userVotedUseful ? 'star-active' : 'star'}
      >
        <Text ml={1}>Useful {votedUsefulCount}</Text>
      </Button>
      {!props.isLoggedIn && <Tooltip />}
    </>
  )
}
