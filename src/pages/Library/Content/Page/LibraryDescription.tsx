import { useMemo } from 'react';
import {
  AuthorDisplay,
  Category,
  ContentStatistics,
  DisplayDate,
  LinkifyText,
  ModerationStatus,
  TagList,
  UsefulStatsButton,
} from 'oa-components';
import { DifficultyLevelRecord } from 'oa-shared';
import { ClientOnly } from 'remix-utils/client-only';
import DifficultyLevel from 'src/assets/icons/icon-difficulty-level.svg';
import TimeNeeded from 'src/assets/icons/icon-time-needed.svg';
import { DownloadWrapper } from 'src/common/DownloadWrapper';
import { buildStatisticsLabel, capitalizeFirstLetter, hasAdminRights } from 'src/utils/helpers';
import { createUsefulStatistic } from 'src/utils/statistics';
import { Alert, Box, Card, Divider, Flex, Heading, Image, Text } from 'theme-ui';

import type { Profile, Project } from 'oa-shared';

interface IProps {
  commentsCount: number;
  item: Project;
  loggedInUser: Profile | undefined;
  votedUsefulCount?: number;
  hasUserVotedUseful: boolean;
  onUsefulClick: () => Promise<void>;
}

export const LibraryDescription = ({
  commentsCount,
  hasUserVotedUseful,
  item,
  loggedInUser,
  onUsefulClick,
  votedUsefulCount,
}: IProps) => {
  const isEditable = useMemo(() => {
    return (
      !!loggedInUser &&
      (hasAdminRights(loggedInUser) || item.author?.username === loggedInUser.username)
    );
  }, [loggedInUser, item.author]);

  const showFeedback = item.moderationFeedback && item.moderation !== 'accepted' && isEditable;

  return (
    <Card variant="responsive">
      <Flex
        data-cy="library-basis"
        data-id={item.id}
        sx={{
          overflow: 'hidden',
          flexDirection: ['column-reverse', 'column-reverse', 'row'],
        }}
      >
        <Flex
          sx={{
            padding: [2, 4],
            gap: 2,
            flexDirection: 'column',
            width: ['100%', '100%', `${(1 / 2) * 100}%`],
          }}
        >
          {item.deleted && (
            <Text color="red" pl={2} mb={2} data-cy="how-to-deleted">
              * Marked for deletion
            </Text>
          )}

          {showFeedback && (
            <Alert variant="info">
              <Box sx={{ textAlign: 'left' }} data-cy="moderationFeedback">
                <Heading as="p" variant="small">
                  Moderator Feedback
                </Heading>
                <Text sx={{ fontSize: 2 }}>{item.moderationFeedback}</Text>
              </Box>
            </Alert>
          )}

          <Heading as="h1" data-cy="project-title">
            {capitalizeFirstLetter(item.title)}
          </Heading>

          <Flex
            sx={{
              alignItems: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <AuthorDisplay author={item.author} />

            <Text variant="auxiliary">
              <DisplayDate
                createdAt={item.createdAt}
                modifiedAt={item.modifiedAt}
                action="Published"
              />
            </Text>

            {item.isDraft && (
              <Flex
                sx={{
                  borderRadius: 1,
                  background: 'lightgrey',
                }}
              >
                <Text
                  sx={{
                    fontSize: '14px',
                    paddingX: 2,
                    paddingY: 1,
                  }}
                >
                  Draft
                </Text>
              </Flex>
            )}

            {item.category && <Category category={item.category} sx={{ fontSize: 2 }} />}
          </Flex>

          <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }} data-cy="project-description">
            <LinkifyText>{item.description}</LinkifyText>
          </Text>

          <Flex sx={{ gap: 3, fontSize: 2 }}>
            <Flex sx={{ flexDirection: ['column', 'row', 'row'] }}>
              <Image loading="lazy" src={TimeNeeded} height="16" width="16" mr="2" mb="2" />
              {item.time}
            </Flex>
            {item.difficultyLevel && (
              <Flex sx={{ flexDirection: ['column', 'row', 'row'] }} data-cy="difficulty-level">
                <Image loading="lazy" src={DifficultyLevel} height="15" width="16" mr="2" mb="2" />
                {DifficultyLevelRecord[item.difficultyLevel]}
              </Flex>
            )}
          </Flex>

          <Flex sx={{ marginTop: 'auto', flexDirection: 'column', gap: 1 }}>
            <TagList tags={item.tags.map((t) => ({ label: t.name }))} />
            <DownloadWrapper
              contentType="projects"
              authorProfileId={item.author?.id}
              fileDownloadCount={item.fileDownloadCount}
              fileLink={item.hasFileLink ? `/api/documents/project/${item.id}/link` : undefined}
              files={item.files?.map((x) => ({
                id: x.id,
                name: x.name,
                size: x.size,
                url: `/api/documents/project/${item.id}/${x.id}`,
              }))}
            />
          </Flex>
        </Flex>
        <Box
          sx={{
            width: ['100%', '100%', `${(1 / 2) * 100}%`],
            position: 'relative',
          }}
        >
          <Box sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                width: '100%',
                height: '0',
                paddingBottom: '75%',
              }}
            ></Box>
            <Box
              sx={{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '0',
                right: '0',
              }}
            >
              {item.coverImage && (
                // 3407 - AspectImage creates divs that can mess up page layout,
                // so using Image here instead and recreating the div layout
                // that was created by AspectImage
                <Image
                  loading="lazy"
                  src={item.coverImage.publicUrl}
                  sx={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                  }}
                  crossOrigin=""
                  alt="project cover image"
                />
              )}
            </Box>
          </Box>

          {!item.isDraft && item.moderation !== 'accepted' && (
            <ModerationStatus
              status={item.moderation}
              sx={{ top: 3, position: 'absolute', right: 3, fontSize: 2 }}
            />
          )}
        </Box>
      </Flex>
      <Divider sx={{ border: '1px solid black', margin: 0 }} />

      <Flex
        sx={{
          alignItems: 'center',
          flexDirection: 'row',
          padding: [2, 3],
          gap: 3,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <ClientOnly fallback={<></>}>
          {() => (
            <Flex sx={{ gap: 2 }}>
              <UsefulStatsButton
                hasUserVotedUseful={hasUserVotedUseful}
                isLoggedIn={loggedInUser ? true : false}
                onUsefulClick={onUsefulClick}
              />
            </Flex>
          )}
        </ClientOnly>

        <ContentStatistics
          statistics={[
            {
              icon: 'show',
              label: buildStatisticsLabel({
                stat: item.totalViews,
                statUnit: 'view',
                usePlural: true,
              }),
              stat: item.totalViews,
            },
            createUsefulStatistic('projects', item.id, votedUsefulCount || 0),
            {
              icon: 'comment-outline',
              label: buildStatisticsLabel({
                stat: commentsCount || 0,
                statUnit: 'comment',
                usePlural: true,
              }),
              stat: commentsCount || 0,
            },
            {
              icon: 'update',
              label: buildStatisticsLabel({
                stat: item.steps.length,
                statUnit: 'step',
                usePlural: true,
              }),
              stat: item.steps.length,
            },
          ]}
          alwaysShow
        />
      </Flex>
    </Card>
  );
};
