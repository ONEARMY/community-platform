import { Category, Icon, IconCountWithTooltip, InternalLink, Username } from 'oa-components';
import { type ResearchItem, ResearchStatusRecord } from 'oa-shared';
import { FollowButtonAction } from 'src/common/FollowButtonAction';
import { Box, Card, Flex, Grid, Heading, Image, Text } from 'theme-ui';

import defaultResearchThumbnail from '../../../assets/images/default-research-thumbnail.jpg';
import { researchStatusColour } from '../researchHelpers';

interface IProps {
  item: ResearchItem;
}

const ResearchListItem = ({ item }: IProps) => {
  const collaborators = item['collaborators'] || [];
  const usefulDisplayCount = item.usefulCount ?? 0;

  const _commonStatisticStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: [1, 2, 2],
  };

  const status = item.status || 'in-progress';

  return (
    <Card
      as="li"
      data-cy="ResearchListItem"
      data-id={item.id}
      sx={{ position: 'relative', mb: 3 }}
      variant="responsive"
    >
      <Flex sx={{ width: '100%', position: 'relative' }}>
        <Grid
          columns={[1, '60px 2fr 1fr']}
          gap="40px"
          sx={{
            width: '100%',
            padding: 3,
          }}
        >
          <Box
            sx={{
              display: ['none', 'block'],
            }}
          >
            <Image
              sx={{
                width: `calc(100% + 32px)`,
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                margin: '-15px',
                verticalAlign: 'top',
                maxWidth: 'none',
              }}
              loading="lazy"
              src={item.image?.publicUrl || defaultResearchThumbnail}
              alt={`Thumbnail of ${item.title}`}
              crossOrigin=""
            />
          </Box>
          <Flex
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Flex
              sx={{
                justifyContent: 'space-between',
                width: '100%',
                gap: 2,
              }}
            >
              <Flex
                sx={{
                  flexDirection: ['column', 'row'],
                  gap: [0, 2],
                }}
              >
                <Heading sx={{ fontSize: [3, 3, 4] }}>
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
                        bottom: 0,
                      },
                    }}
                  >
                    {item.title}
                  </InternalLink>
                </Heading>
                {item.category && <Category category={item.category} sx={{ fontSize: 2 }} />}
              </Flex>
              <Text
                sx={{
                  display: ['inline-block', 'none', 'none'],
                  verticalAlign: 'middle',
                  color: 'black',
                  fontSize: 1,
                  background: researchStatusColour(status),
                  padding: 1,
                  borderRadius: 1,
                  marginLeft: 4,
                  marginBottom: 'auto',
                  whiteSpace: 'nowrap',
                  minWidth: '75px',
                }}
                data-cy="ItemResearchStatus"
              >
                {ResearchStatusRecord[status]}
              </Text>
            </Flex>
            <Flex
              sx={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                {item.author && <Username user={item.author} sx={{ position: 'relative' }} />}
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
                    display: ['none', 'inline-block', 'inline-block'],
                    verticalAlign: 'middle',
                    color: 'black',
                    fontSize: 1,
                    background: researchStatusColour(status),
                    padding: 1,
                    borderRadius: 1,
                    borderBottomRightRadius: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ResearchStatusRecord[status]}
                </Text>
              </Flex>
              {/* Show these on mobile, hide on tablet & above. */}
              <Box
                sx={{
                  display: ['flex', 'none', 'none'],
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <FollowButtonAction
                  contentType="research"
                  itemId={item.id}
                  showIconOnly
                  hideSubscribeIcon
                  variant="subtle"
                  small
                  sx={{
                    cursor: 'default',
                    padding: 0,
                    height: 'auto',
                    minWidth: 'auto',
                    border: 'none',
                    lineHeight: 0,
                    '& > div': {
                      position: 'relative',
                      px: 0,
                    },
                  }}
                />
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
          {/* Hide these on mobile, show on tablet & above. */}
          <Box
            sx={{
              display: ['none', 'flex', 'flex'],
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: [4, 6, 8],
            }}
          >
            <FollowButtonAction
              contentType="research"
              itemId={item.id}
              showIconOnly
              hideSubscribeIcon
              variant="subtle"
              small
              tooltipUnfollow="You are following this"
              sx={{
                cursor: 'default',
                padding: 0,
                height: 'auto',
                minWidth: 'auto',
                border: 'none',
                lineHeight: 0,
                '& > div': {
                  position: 'relative',
                  px: 0,
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            />
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
        </Grid>
      </Flex>
    </Card>
  );
};

export default ResearchListItem;
