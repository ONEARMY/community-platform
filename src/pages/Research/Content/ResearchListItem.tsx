import { formatDistanceToNow } from 'date-fns';
import { observer } from 'mobx-react';
import {
  Category,
  FollowIcon,
  Icon,
  IconCountWithTooltip,
  InternalLink,
  Username,
} from 'oa-components';
import { type ResearchItem, ResearchStatusRecord, UserRole } from 'oa-shared';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { useSubscription } from 'src/stores/Subscription/useSubscription';
import { Box, Card, Flex, Grid, Heading, Image, Text } from 'theme-ui';
import defaultResearchThumbnail from '../../../assets/images/default-research-thumbnail.jpg';
import { researchStatusColour } from '../researchHelpers';

interface IProps {
  item: ResearchItem;
  showWeeklyVotes?: boolean;
}

const ResearchListItem = observer(({ item, showWeeklyVotes }: IProps) => {
  const { isSubscribed } = useSubscription('research', item.id);
  const collaborators = item['collaborators'] || [];
  const usefulDisplayCount = item.usefulCount ?? 0;
  const showWeeklyBadge = showWeeklyVotes && (item.usefulVotesLastWeek || 0) > 0;

  const _commonStatisticStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: [1, 2, 2],
  };

  const status = item.status || 'in-progress';

  const relativeLabel =
    item.modifiedAt != null ? formatDistanceToNow(item.modifiedAt, { addSuffix: true }) : null;

  return (
    <Card
      as="li"
      data-cy="ResearchListItem"
      data-id={item.id}
      sx={{
        position: 'relative',
        p: [3, 4],
        border: '2px solid',
        borderRadius: 2,
        '&:last-of-type': {
          borderBottom: '2px solid',
        },
      }}
      variant="responsive"
    >
      <Flex sx={{ width: '100%', position: 'relative' }}>
        <Grid
          columns={['120px 1fr', '175px 1fr', '263px 1fr']}
          gap={[3, 4, 8]}
          sx={{
            width: '100%',
            gridTemplateRows: ['minmax(120px, auto)', 'minmax(175px, auto)', 'minmax(175px, auto)'],
            alignItems: 'start',
          }}
        >
          <Box sx={{ position: 'relative', lineHeight: 0 }}>
            <Image
              sx={{
                width: ['120px', '175px', '263px'],
                height: ['120px', '175px', '175px'],
                objectFit: 'cover',
                borderRadius: 1,
                display: 'block',
              }}
              loading="lazy"
              src={item.image?.publicUrl || defaultResearchThumbnail}
              alt={`Thumbnail of ${item.title}`}
              crossOrigin=""
            />
            {isSubscribed && (
              <FollowIcon
                tooltip="You are following updates"
                sx={{
                  position: 'absolute',
                  top: 1,
                  right: 1,
                  zIndex: 1,
                  backgroundColor: 'white',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'black',
                  borderRadius: '50%',
                  padding: 1,
                }}
              />
            )}
          </Box>
          <Flex
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              minWidth: 0,
            }}
          >
            <Flex sx={{ pb: 1 }}>
              <Heading
                sx={{
                  fontSize: [3, 4],
                  lineHeight: '1.2',
                  display: '-webkit-box',
                  WebkitLineClamp: [2, 2, 2],
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                }}
              >
                <InternalLink
                  to={`/research/${encodeURIComponent(item.slug)}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:focus': {
                      outline: 'none',
                      textDecoration: 'none',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      right: 0,
                      height: '175px',
                    },
                  }}
                >
                  {item.title}
                </InternalLink>
              </Heading>
            </Flex>
            <Flex
              sx={{
                width: '100%',
                alignItems: 'center',
                pb: 2,
              }}
            >
              <Flex
                sx={{
                  alignItems: ['flex-start', 'flex-start', 'center'],
                  flexDirection: ['column', 'row'],
                  flexWrap: ['nowrap', 'wrap'],
                  gap: 1,
                }}
              >
                {item.author && (
                  <Username
                    user={item.author}
                    sx={{
                      position: 'relative',
                      paddingX: 0,
                      paddingY: 0,
                      marginLeft: 0,
                      transform: 'translateY(-1px)',
                      fontSize: 2,
                    }}
                  />
                )}
                {Boolean(collaborators.length) && (
                  <Text
                    sx={{
                      ml: 4,
                      display: ['none', 'block'],
                      fontSize: 1,
                      color: 'darkGrey',
                      transform: 'translateY(2px)',
                    }}
                  >
                    {collaborators.length +
                      (collaborators.length === 1 ? ' contributor' : ' contributors')}
                  </Text>
                )}
                <Text
                  sx={{
                    fontSize: [1, 2],
                    color: 'darkGrey',
                    transform: 'translateX(2px)',
                  }}
                >
                  {relativeLabel != null && `updated ${relativeLabel}`}
                </Text>
              </Flex>
            </Flex>
            <Text
              sx={{
                display: ['none', '-webkit-box'],
                fontFamily: 'body',
                lineHeight: '1.4',
                fontSize: 3,
                color: 'darkGrey',
                width: '100%',
                minHeight: 0,
                flexShrink: 1,
                WebkitLineClamp: [2, 2, 3],
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              {item.description}
            </Text>
            <Flex
              sx={{
                justifyContent: 'space-between',
                width: '100%',
                pt: [0, 3],
              }}
            >
              <Flex
                sx={{
                  justifyContent: 'flex-start',
                  gap: 2,
                }}
              >
                <Flex sx={{ display: ['none', 'flex', 'flex'] }}>
                  {item.category && <Category category={item.category} sx={{ fontSize: 1 }} />}
                </Flex>
                <Text
                  sx={{
                    display: 'inline-block',
                    verticalAlign: 'bottom',
                    color: 'black',
                    fontSize: 1,
                    background: researchStatusColour(status),
                    padding: 1,
                    borderRadius: 1,
                    whiteSpace: 'nowrap',
                  }}
                  data-cy="ItemResearchStatus"
                >
                  {ResearchStatusRecord[status]}
                </Text>
              </Flex>
              <Flex>
                {/* Hide these on mobile, show on tablet & above. */}
                <Box
                  sx={{
                    display: ['none', 'flex', 'flex'],
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 2,
                  }}
                >
                  <IconCountWithTooltip
                    count={usefulDisplayCount}
                    icon="star-active"
                    text="How useful is it"
                  />
                  <IconCountWithTooltip
                    count={item.commentCount || 0}
                    icon="comment"
                    text="Total comments"
                  />

                  <IconCountWithTooltip
                    count={item.updateCount}
                    dataCy="ItemUpdateText"
                    icon="update"
                    text="Amount of updates"
                  />
                </Box>
                {/* Show these on mobile, hide on tablet & above. */}
                <Box
                  sx={{
                    display: ['flex', 'none', 'none'],
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Text color="black" sx={_commonStatisticStyle}>
                    {usefulDisplayCount}
                    <Icon glyph="star-active" ml={1} />
                  </Text>
                  <Text color="black" sx={_commonStatisticStyle}>
                    {item.commentCount || 0}
                    <Icon glyph="comment" ml={1} />
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Grid>
      </Flex>
      {showWeeklyBadge && (
        <AuthWrapper roleRequired={UserRole.BETA_TESTER} borderLess>
          <Flex sx={{ justifyContent: 'flex-end' }}>
            <Box
              sx={{
                color: 'red',
                padding: '2px',
              }}
            >
              {item.usefulVotesLastWeek}
            </Box>
          </Flex>
        </AuthWrapper>
      )}
    </Card>
  );
});

export default ResearchListItem;
