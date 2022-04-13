import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Text from 'src/components/Text'
import { Button } from 'oa-components'
import Tooltip from 'src/components/Tooltip'
import theme from 'src/themes/styled.theme'

interface IProps {
  hasUserVotedUseful: boolean
  votedUsefulCount: number
  isLoggedIn: boolean
  onUsefulClick: () => void
}
export const UsefulStatsButton = (props: IProps) => {
  const history = useHistory()

  const [votedUsefulCount, setVotedUsefulCount] = useState<number>()
  const [hasUserVotedUseful, setHasUserVotedUseful] = useState<boolean>()

  useEffect(
    () => setHasUserVotedUseful(props.hasUserVotedUseful),
    [props.hasUserVotedUseful],
  )
  useEffect(
    () => setVotedUsefulCount(props.votedUsefulCount),
    [props.votedUsefulCount],
  )
  const handleUsefulClick = () => {
    props.onUsefulClick()
  }

  return props.isLoggedIn ? (
    <>
      <Button
        data-cy="vote-useful"
        variant="subtle"
        onClick={handleUsefulClick}
        ml="8px"
        sx={{ fontSize: '14px' }}
        backgroundColor={theme.colors.softyellow}
        icon={hasUserVotedUseful ? 'star-active' : 'star'}
      >
        <Text ml={1}>Useful {votedUsefulCount}</Text>
      </Button>
    </>
  ) : (
    <>
      <Button
        data-cy="vote-useful-redirect"
        data-tip={'Login to add your vote'}
        variant="subtle"
        onClick={() => history.push('/sign-in')}
        ml="8px"
        sx={{ fontSize: '14px' }}
        backgroundColor={theme.colors.softyellow}
        icon={hasUserVotedUseful ? 'star-active' : 'star'}
      >
        <Text ml={1}>Useful {votedUsefulCount}</Text>
      </Button>
      <Tooltip />
    </>
  )
}
