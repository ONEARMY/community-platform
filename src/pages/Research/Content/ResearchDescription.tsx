import { max } from 'date-fns';
import {
  AuthorDisplay,
  Category,
  ContentStatistics,
  DisplayDate,
  FollowButton,
  LinkifyText,
  TagList,
  UsefulStatsButton,
  Username,
} from 'oa-components';
import { PremiumTier, type Profile, type ResearchItem, ResearchStatusRecord } from 'oa-shared';
import { useMemo } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { userHasPremiumTier } from 'src/common/PremiumTierWrapper';
import { DraftTag } from 'src/pages/common/Drafts/DraftTag';
import { buildStatisticsLabel } from 'src/utils/helpers';
import { createUsefulStatistic } from 'src/utils/statistics';
import { Card, Divider, Flex, Heading, Text } from 'theme-ui';
import { researchStatusColour } from '../researchHelpers';

interface IProps {
  research: ResearchItem;
  isEditable: boolean;
  isDeletable: boolean;
  activeUser: Profile | undefined;
  votedUsefulCount?: number;
  hasUserVotedUseful: boolean;
  hasUserSubscribed: boolean;
  subscribersCount: number;
  commentsCount: number;
  updatesCount: number;
  onUsefulClick: () => Promise<void>;
  onFollowClick: () => void;
}

const ResearchDescription = (props: IProps) => {
  const { research, subscribersCount, votedUsefulCount, commentsCount, updatesCount } = props;

  const lastUpdated = useMemo(() => {
    const dates = [
      research?.modifiedAt,
      ...(research?.updates?.map((update) => update?.modifiedAt) || []),
    ]
      .filter((date): date is Date => date !== null)
      .map((date) => new Date(date));

    return dates.length > 0 ? max(dates) : new Date();
  }, [research]);

  const hasContributors = research.collaborators && research.collaborators.length;

  return (
    <Card variant="responsive">
      <Flex
        data-cy="research-basis"
        data-id={research.id}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          gap: 4,
          padding: [2, 4],
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          {research.deleted && (
            <Text color="red" pl={2} mb={2} data-cy="research-deleted">
              * Marked for deletion
            </Text>
          )}

          <Heading as="h1" data-testid="research-title">
            {research.title}
          </Heading>

          <Flex
            sx={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <AuthorDisplay author={research.author} />

            {hasContributors ? (
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                <Text variant="auxiliary" sx={{ color: 'lightgrey' }}>
                  With contributions from
                </Text>
                {research.collaborators.map((contributor, key) => (
                  <Username key={key} user={contributor} />
                ))}
              </Flex>
            ) : null}

            {research.isDraft && <DraftTag />}

            <Text variant="auxiliary">
              <DisplayDate
                createdAt={research.createdAt}
                modifiedAt={lastUpdated.toISOString()}
                action="Started"
              />
            </Text>

            {research.category && <Category category={research.category} sx={{ fontSize: 2 }} />}

            <Flex
              sx={{
                borderRadius: 1,
                background: researchStatusColour(research.status),
              }}
            >
              <Text
                sx={{
                  fontSize: '14px',
                  paddingX: 2,
                  paddingY: 1,
                }}
              >
                {research.status ? ResearchStatusRecord[research.status] : 'In progress'}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
          <LinkifyText>{research.description}</LinkifyText>
        </Text>

        <TagList tags={research.tags.map((t) => ({ label: t.name }))} />
      </Flex>

      <Divider sx={{ border: '1px solid black', margin: 0 }} />

      <Flex
        sx={{
          flexDirection: 'row',
          padding: [2, 3],
          gap: 3,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <ClientOnly fallback={<></>}>
          {() => (
            <Flex sx={{ gap: 3 }}>
              <UsefulStatsButton
                hasUserVotedUseful={props.hasUserVotedUseful}
                isLoggedIn={!!props.activeUser}
                onUsefulClick={props.onUsefulClick}
              />
              <FollowButton
                hasUserSubscribed={props.hasUserSubscribed}
                isLoggedIn={!!props.activeUser}
                onFollowClick={props.onFollowClick}
                tooltipFollow="Follow to be notified about new updates"
                tooltipUnfollow="Unfollow to stop being notified about new updates"
              />
            </Flex>
          )}
        </ClientOnly>

        <ContentStatistics
          statistics={[
            {
              icon: 'show',
              label: buildStatisticsLabel({
                stat: research.totalViews || 0,
                statUnit: 'view',
                usePlural: true,
              }),
              stat: research.totalViews || 0,
            },
            {
              icon: 'thunderbolt-grey',
              label: buildStatisticsLabel({
                stat: subscribersCount || 0,
                statUnit: 'following',
                usePlural: false,
              }),
              stat: subscribersCount || 0,
            },
            createUsefulStatistic(
              'research',
              research.id,
              votedUsefulCount || 0,
              userHasPremiumTier(props.activeUser, PremiumTier.ONE),
            ),
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
                stat: updatesCount || 0,
                statUnit: 'update',
                usePlural: true,
              }),
              stat: updatesCount || 0,
            },
          ]}
          alwaysShow
        />
      </Flex>
    </Card>
  );
};

export default ResearchDescription;
