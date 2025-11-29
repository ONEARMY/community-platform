import { Box, Card, Flex, Image, Text } from 'theme-ui';

import ForumIcon from '../../assets/icons/icon-forum.svg';
import HowToCountIcon from '../../assets/icons/icon-library.svg';
import ResearchIcon from '../../assets/icons/icon-research.svg';
import starActiveSVG from '../../assets/icons/icon-star-active.svg';
import { ElWithBeforeIcon } from '../ElWithBeforeIcon/ElWithBeforeIcon';
import { ExternalLink } from '../ExternalLink/ExternalLink';
import { Icon } from '../Icon/Icon';
import { InternalLink } from '../InternalLink/InternalLink';

import type { MapPin, Profile } from 'oa-shared';
import type { ThemeUIStyleObject } from 'theme-ui';

export interface UserStatisticsProps {
  profile: Pick<Profile, 'id' | 'username' | 'badges' | 'totalViews' | 'country'>;
  pin?: Pick<MapPin, 'country'>;
  libraryCount: number;
  usefulCount: number;
  researchCount: number;
  questionCount: number;
  showViews: boolean;
  sx?: ThemeUIStyleObject | undefined;
}

export const UserStatistics = (props: UserStatisticsProps) => {
  if (isEmpty({ ...props })) {
    return null;
  }

  return (
    <Card
      sx={{
        backgroundColor: 'background',
        border: 0,
        padding: 1,
        ...props.sx,
      }}
    >
      <Flex
        sx={{
          gap: 2,
          flexDirection: ['row', 'column', 'column'],
          alignItems: ['center', 'flex-start', 'flex-start'],
          justifyContent: ['center', 'flex-start', 'flex-start'],
        }}
      >
        {props.pin && (
          <InternalLink
            to={'/map#' + props.profile.username}
            sx={{ color: 'black', ':hover': { textDecoration: 'underline' } }}
            data-testid="location-link"
          >
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <Icon glyph="map" size={22} />
              <Text>Location: {props.pin.country || 'View on Map'}</Text>
            </Flex>
          </InternalLink>
        )}

        <Flex sx={{ gap: 2, flexDirection: 'column' }}>
          {props?.profile.badges?.map((badge) => (
            <Flex
              key={badge.id}
              sx={{ alignItems: 'center', gap: 1 }}
              data-testid={`badge_${badge.name}`}
            >
              <Image width={20} height={20} src={badge.imageUrl} />
              <Box>
                {badge.actionUrl ? (
                  <ExternalLink href={badge.actionUrl} target="_blank">
                    <Text sx={{ color: 'black' }}>{badge.displayName}</Text>
                  </ExternalLink>
                ) : (
                  <Text sx={{ color: 'black' }}>{badge.displayName}</Text>
                )}
              </Box>
            </Flex>
          ))}

          {props.usefulCount > 0 && (
            <Flex data-testid="useful-stat">
              <ElWithBeforeIcon icon={starActiveSVG} />
              {`Useful: ${props.usefulCount}`}
            </Flex>
          )}

          {props.libraryCount > 0 && (
            <InternalLink
              to={'/library?q=' + props.profile.username}
              sx={{ color: 'black', ':hover': { textDecoration: 'underline' } }}
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
              sx={{ color: 'black', ':hover': { textDecoration: 'underline' } }}
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
              sx={{ color: 'black', ':hover': { textDecoration: 'underline' } }}
              data-testid="questions-link"
            >
              <Flex data-testid="questions-stat">
                <ElWithBeforeIcon icon={ForumIcon} />
                {`Questions: ${props.questionCount}`}
              </Flex>
            </InternalLink>
          )}

          {props.showViews && props.profile.totalViews > 0 && (
            <Flex data-testid="profile-views-stat">
              <Icon glyph="show" size={22} />
              <Box ml={1}>{`Views: ${props.profile.totalViews}`}</Box>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

const isEmpty = (props: UserStatisticsProps & { pin?: Pick<MapPin, 'country'> }) =>
  !props.pin &&
  !props.profile.badges?.length &&
  !props.profile.country &&
  !props.libraryCount &&
  !props.researchCount &&
  !props.profile.totalViews &&
  !props.usefulCount;
