import { Box, Card, Flex } from 'theme-ui'

import HowToCountIcon from '../../assets/icons/icon-how-to.svg'
import ResearchIcon from '../../assets/icons/icon-research.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'
import { ElWithBeforeIcon } from '../ElWithBeforeIcon/ElWithBeforeIcon'
import { ExternalLink } from '../ExternalLink/ExternalLink'
import { Icon } from '../Icon/Icon'
import { InternalLink } from '../InternalLink/InternalLink'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface UserStatisticsProps {
  userName: string
  country?: string
  isVerified: boolean
  isSupporter?: boolean
  howtoCount: number
  usefulCount: number
  researchCount: number
  sx?: ThemeUIStyleObject | undefined
}

export const UserStatistics = (props: UserStatisticsProps) => {
  const hasLocation =
    props.country !== undefined && props.userName !== undefined

  if (isEmpty(props) && !hasLocation) {
    return null
  }

  return (
    <Card
      sx={{
        p: 2,
        backgroundColor: 'background',
        ...props.sx,
      }}
    >
      <Flex
        sx={{
          gap: 2,
          flexDirection: 'column',
        }}
      >
        {props.isVerified && (
          <Flex data-testid="verified-stat">
            <Icon glyph="verified" size={22} />
            <Box ml={1}>Verified</Box>
          </Flex>
        )}

        {props?.isSupporter ? (
          <Flex data-testid="supporter-stat">
            <Icon glyph={'supporter'} size={22} />
            <Box ml={1}>
              <ExternalLink
                href="https://www.patreon.com/one_army"
                target="_blank"
                sx={{ color: 'black' }}
              >
                Supporter
              </ExternalLink>
            </Box>
          </Flex>
        ) : null}

        {hasLocation ? (
          <InternalLink
            to={'/map/#' + props.userName}
            sx={{ color: 'black' }}
            data-testid="location-link"
          >
            <Flex>
              <Icon glyph="location-on" size={22} />
              <Box ml={1}>{props.country || 'View on Map'}</Box>
            </Flex>
          </InternalLink>
        ) : null}

        {props.usefulCount ? (
          <Flex data-testid="useful-stat">
            <ElWithBeforeIcon icon={starActiveSVG} />
            Useful:&nbsp;{props.usefulCount}
          </Flex>
        ) : null}

        {props.howtoCount ? (
          <InternalLink
            to={'/how-to?q=' + props.userName}
            sx={{ color: 'black' }}
            data-testid="howto-link"
          >
            <Flex data-testid="howto-stat">
              <ElWithBeforeIcon icon={HowToCountIcon} />
              How‑to:&nbsp;{props.howtoCount}
            </Flex>
          </InternalLink>
        ) : null}

        {props.researchCount ? (
          <InternalLink
            to={'/research?q=' + props.userName}
            sx={{ color: 'black' }}
            data-testid="research-link"
          >
            <Flex data-testid="research-stat">
              <ElWithBeforeIcon icon={ResearchIcon} />
              Research:&nbsp;{props.researchCount}
            </Flex>
          </InternalLink>
        ) : null}
      </Flex>
    </Card>
  )
}

const isEmpty = (props: UserStatisticsProps) =>
  !props.isVerified &&
  !props.isSupporter &&
  !props.usefulCount &&
  !props.howtoCount
