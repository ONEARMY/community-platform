import { Box, Image } from 'rebass'
import EventsIcon from 'src/assets/icons/icon-events.svg'
import HowToCountIcon from 'src/assets/icons/icon-how-to.svg'
import VerifiedBadgeIcon from 'src/assets/icons/icon-verified-badge.svg'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'
import {Icon} from 'oa-components'
import { Link } from 'src/components/Links'
import type { IUserPP } from 'src/models'
import theme from 'src/themes/styled.theme'
import styled from '@emotion/styled'


export const UserStatsBoxItem = styled.div`
  margin: ${theme.space[2]}px 0;
  display: flex;
  align-items: center;

  &:first-child {
    margin-top: 0;
  }
`

export const UserStatsBox = styled(Box)`
  border: 2px solid black;
  border-radius: ${theme.space[2]}px;
  background-color: ${theme.colors.background};
`

// Comment on 6.05.20 by BG : renderCommitmentBox commented for now, will be reused with #974

interface IProps {
  user: IUserPP
}

export const UserStats = ({user}:IProps) => {
  let howtoCount = 0
  let eventCount = 0
  try {
    howtoCount = Object.keys(user.stats!.userCreatedHowtos).length
    eventCount = Object.keys(user.stats!.userCreatedEvents).length
  } catch (error) {
    // Comment on 12.10.20 by CC: would be nice if user stats had their own display to make conditional
    // logic easier, but for now will just use a try-catch to also fix cases broken on dev during migration attempts
  }

  if (!user.badges?.verified && !user.location && !howtoCount && !howtoCount) {
    return null
  }

  return (
    <UserStatsBox mt={3} p={2} pb={0}>
      {user.badges?.verified && (
        <UserStatsBoxItem>
          <Image src={VerifiedBadgeIcon} width="22px" height="22px" />
          <Box ml="5px">Verified</Box>
        </UserStatsBoxItem>
      )}
      {user.location?.latlng && (
        <Link color={'black'} to={'/map/#' + user.userName}>
          <UserStatsBoxItem>
            <Icon glyph="location-on" size="22"></Icon>
            <Box ml="5px">{user.location?.country || 'View on Map'}</Box>
          </UserStatsBoxItem>
        </Link>
      )}
      {howtoCount > 0 && (
        <UserStatsBoxItem>
          <ElWithBeforeIcon IconUrl={HowToCountIcon} />
          How‑to:&nbsp;{howtoCount}
        </UserStatsBoxItem>
      )}
      {eventCount > 0 && (
        <UserStatsBoxItem>
          <ElWithBeforeIcon IconUrl={EventsIcon} />
          Events:&nbsp;{eventCount}
        </UserStatsBoxItem>
      )}
    </UserStatsBox>
  )
}
