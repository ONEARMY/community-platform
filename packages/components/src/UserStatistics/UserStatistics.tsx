import { Box, Card, Flex } from 'theme-ui'

import ForumIcon from '../../assets/icons/icon-forum.svg'
import HowToCountIcon from '../../assets/icons/icon-library.svg'
import ResearchIcon from '../../assets/icons/icon-research.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'
import { CardButton } from '../CardButton/CardButton'
import { ElWithBeforeIcon } from '../ElWithBeforeIcon/ElWithBeforeIcon'
import { ExternalLink } from '../ExternalLink/ExternalLink'
import { Icon } from '../Icon/Icon'
import { InternalLink } from '../InternalLink/InternalLink'

import type { MapPin, Profile } from 'oa-shared'
import type { ThemeUIStyleObject } from 'theme-ui'

export interface UserStatisticsProps {
  profile: Pick<
    Profile,
    'id' | 'username' | 'isVerified' | 'isSupporter' | 'totalViews'
  >
  pin?: Pick<MapPin, 'country'>
  libraryCount: number
  usefulCount: number
  researchCount: number
  questionCount: number
  sx?: ThemeUIStyleObject | undefined
}

export const UserStatistics = (props: UserStatisticsProps) => {
  if (isEmpty({ ...props })) {
    return null
  }

  return (
    <Card
      sx={{
        p: 2,
        backgroundColor: 'background',
        border: 0,
        ...props.sx,
      }}
    >
      <Flex
        sx={{
          gap: 4,
          flexDirection: ['row', 'column', 'column'],
          alignItems: ['center', 'flex-start', 'flex-start'],
          justifyContent: ['center', 'flex-start', 'flex-start'],
        }}
      >
        {props.pin && (
          <InternalLink
            to={'/map/#' + props.profile.username}
            sx={{ color: 'black' }}
            data-testid="location-link"
          >
            <CardButton
              sx={{
                p: '12px',
                border: '2px solid black',
                boxShadow: '0px 2px 0px 0px black',
              }}
            >
              <Flex sx={{ alignItems: 'center' }}>
                <Icon glyph="map" size={22} />
                <Box ml={1}>{props.pin.country || 'View on Map'}</Box>
              </Flex>
            </CardButton>
          </InternalLink>
        )}

        <Flex sx={{ gap: 2, flexDirection: 'column' }}>
          {props.profile.isVerified && (
            <Flex data-testid="verified-stat">
              <Icon glyph="verified" size={22} />
              <Box ml={1}>Verified</Box>
            </Flex>
          )}

          {props?.profile.isSupporter && (
            <Flex data-testid="supporter-stat">
              <Icon glyph="supporter" size={22} />
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
          )}

          {props.usefulCount > 0 && (
            <Flex data-testid="useful-stat">
              <ElWithBeforeIcon icon={starActiveSVG} />
              {`Useful: ${props.usefulCount}`}
            </Flex>
          )}

          {props.libraryCount > 0 && (
            <InternalLink
              to={'/library?q=' + props.profile.username}
              sx={{ color: 'black' }}
              data-testid="library-link"
            >
              <Flex data-testid="library-stat">
                <ElWithBeforeIcon icon={HowToCountIcon} />
                {`Library: ${props.libraryCount}`}
              </Flex>
            </InternalLink>
          )}

          {props.researchCount > 0 && (
            <InternalLink
              to={'/research?q=' + props.profile.username}
              sx={{ color: 'black' }}
              data-testid="research-link"
            >
              <Flex data-testid="research-stat">
                <ElWithBeforeIcon icon={ResearchIcon} />
                {`Research: ${props.researchCount}`}
              </Flex>
            </InternalLink>
          )}

          {props.questionCount > 0 && (
            <InternalLink
              to={'/questions'}
              sx={{ color: 'black' }}
              data-testid="questions-link"
            >
              <Flex data-testid="questions-stat">
                <ElWithBeforeIcon icon={ForumIcon} />
                {`Questions: ${props.questionCount}`}
              </Flex>
            </InternalLink>
          )}

          {props.profile.totalViews > 0 && (
            <Flex data-testid="profile-views-stat">
              <Icon glyph="show" size={22} />
              <Box ml={1}>{`Views: ${props.profile.totalViews}`}</Box>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}

const isEmpty = (
  props: UserStatisticsProps & { pin?: Pick<MapPin, 'country'> },
) =>
  !props.pin &&
  !props.profile.isVerified &&
  !props.profile.isSupporter &&
  !props.libraryCount &&
  !props.researchCount &&
  !props.profile.totalViews &&
  !props.usefulCount
