import { Link as RouterLink } from 'react-router';
import { Category, IconCountWithTooltip, ModerationStatus, Username } from 'oa-components';
import { Highlighter } from 'src/common/Highlighter';
import { capitalizeFirstLetter } from 'src/utils/helpers';
import { Box, Card, Flex, Heading, Image } from 'theme-ui';

import type { Project } from 'oa-shared';
import { FollowButtonAction } from 'src/common/FollowButtonAction';

type ProjectCardProps = {
  item: Project;
  query?: string;
};

export const ProjectCard = ({ item, query }: ProjectCardProps) => {
  const searchWords = [query || ''];

  return (
    <Card data-cy="card" sx={{ marginX: [2, 0] }}>
      <RouterLink to={`/library/${encodeURIComponent(item.slug)}`}>
        <Flex
          sx={{
            background: 'background',
            height: '60%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {item.coverImage && (
            <Image
              style={{
                width: '100%',
                height: 'calc(((350px) / 3) * 2)',
                objectFit: 'cover',
              }}
              loading="lazy"
              src={item.coverImage?.publicUrl || ''}
              crossOrigin=""
              alt={`Cover image of ${item.title}`}
            />
          )}
          {item.moderation && item.moderation !== 'accepted' && (
            <ModerationStatus
              status={item.moderation}
              sx={{
                top: 2,
                position: 'absolute',
                right: 2,
                alignSelf: 'self-start',
              }}
            />
          )}
        </Flex>
        <Flex
          sx={{
            flexDirection: 'column',
            gap: 2,
            padding: 2,
            height: '40%',
            justifyContent: 'space-between',
          }}
        >
          <Flex sx={{ gap: 1, flexDirection: 'column' }}>
            <Heading as="h2" variant="small" color={'black'}>
              <Highlighter
                searchWords={searchWords}
                textToHighlight={capitalizeFirstLetter(item.title)}
              />
            </Heading>

            {item.author && (
              <Box>
                <Username user={item.author} />
              </Box>
            )}
          </Flex>

          <Flex sx={{ justifyContent: 'flex-end' }}>
            {item.category && (
              <Flex sx={{ flex: 1 }}>
                <Category category={item.category} />
              </Flex>
            )}

            <Flex
              sx={{
                gap: 2,
                justifyContent: 'flex-end',
              }}
            >
              <FollowButtonAction
                contentType="projects"
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
              <IconCountWithTooltip count={item.totalViews || 0} icon="show" text="Views" />
              <IconCountWithTooltip
                count={item.usefulCount || 0}
                icon="star-active"
                text="How useful is it"
              />
            </Flex>
          </Flex>
        </Flex>
      </RouterLink>
    </Card>
  );
};
