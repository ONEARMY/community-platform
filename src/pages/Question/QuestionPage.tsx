import { observer } from 'mobx-react';
import {
  AuthorDisplay,
  Category,
  ContentStatistics,
  DisplayDate,
  ImageGallery,
  LinkifyText,
  TagList,
  UsefulStatsButton,
} from 'oa-components';
import type { Question } from 'oa-shared';
import { PremiumTier } from 'oa-shared';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import PageHeader from 'src/common/PageHeader';
import { userHasPremiumTier } from 'src/common/PremiumTierWrapper';
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { useUsefulVote } from 'src/stores/UsefulVote/useUsefulVote';
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery';
import { buildStatisticsLabel, hasAdminRights } from 'src/utils/helpers';
import { createUsefulStatistic } from 'src/utils/statistics';
import { Box, Button, Card, Divider, Flex, Heading, Text } from 'theme-ui';
import { CommentSectionSupabase } from '../common/CommentsSupabase/CommentSectionSupabase';
import { DraftTag } from '../common/Drafts/DraftTag';

interface IProps {
  question: Question;
}

export const QuestionPage = observer(({ question }: IProps) => {
  const { profile: activeUser } = useProfileStore();
  const { hasVoted, usefulCount, toggle: toggleVote } = useUsefulVote('questions', question.id, question.usefulCount);
  const [subscribersCount, setSubscribersCount] = useState<number>(question.subscriberCount);

  const isEditable = useMemo(() => {
    return hasAdminRights(activeUser) || question.author?.username === activeUser?.username;
  }, [activeUser, question.author]);

  return (
    <Flex
      sx={{
        alignSelf: 'center',
        width: '100%',
        maxWidth: '1000px',
        flexDirection: 'column',
      }}
    >
      <PageHeader
        actions={
          isEditable && (
            <Link to={'/questions/' + question.slug + '/edit'}>
              <Button type="button" variant="primary" data-cy="edit">
                Edit
              </Button>
            </Link>
          )
        }
      >
        <Breadcrumbs
          steps={[
            { text: 'Question', link: '/questions' },
            ...(question.category
              ? [
                  {
                    text: question.category.name,
                    link: `/questions?category=${question.category.id}`,
                  },
                ]
              : []),
            { text: question.title },
          ]}
        />
      </PageHeader>

      <Card data-cy="question-body" sx={{ position: 'relative' }} variant="responsive">
        <Flex sx={{ flexDirection: 'column', padding: [3, 4], gap: 4 }}>
          <Heading as="h1" data-cy="question-title" data-testid="question-title">
            {question.title}
          </Heading>

          <Flex sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <AuthorDisplay author={question.author} />

            <Text variant="auxiliary">
              <DisplayDate
                createdAt={question.createdAt}
                publishedAt={question.publishedAt}
                modifiedAt={question.modifiedAt}
                publishedAction="Asked"
              />
            </Text>

            {question.isDraft && <DraftTag />}

            {question.category && <Category category={question.category} />}
          </Flex>

          <Text variant="paragraph" data-cy="question-description" sx={{ whiteSpace: 'pre-line' }}>
            <LinkifyText>{question.description}</LinkifyText>
          </Text>

          {question.images && (
            <ImageGallery
              images={formatImagesForGallery(question.images) as any}
              allowPortrait={true}
            />
          )}

          {question.tags && (
            <TagList data-cy="question-tags" tags={question.tags.map((t) => ({ label: t.name }))} />
          )}
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
          <Box>
            <ClientOnly fallback={<></>}>
              {() => <UsefulStatsButton hasUserVotedUseful={hasVoted} isLoggedIn={!!activeUser} onUsefulClick={toggleVote} />}
            </ClientOnly>
          </Box>

          <ContentStatistics
            statistics={[
              {
                icon: 'show',
                label: buildStatisticsLabel({
                  stat: question.totalViews,
                  statUnit: 'view',
                  usePlural: true,
                }),
                stat: question.totalViews,
              },
              {
                icon: 'thunderbolt-grey',
                label: buildStatisticsLabel({
                  stat: subscribersCount,
                  statUnit: 'following',
                  usePlural: false,
                }),
                stat: subscribersCount,
              },
              createUsefulStatistic(
                'questions',
                question.id,
                usefulCount,
                userHasPremiumTier(activeUser, PremiumTier.ONE),
              ),
              {
                icon: 'comment-outline',
                label: buildStatisticsLabel({
                  stat: question.commentCount,
                  statUnit: 'comment',
                  usePlural: true,
                }),
                stat: question.commentCount,
              },
            ]}
            alwaysShow
          />
        </Flex>
      </Card>

      <ClientOnly fallback={<></>}>
        {() => (
          <Card
            data-cy="comments-section"
            variant="responsive"
            sx={{
              background: 'softblue',
              borderTop: 0,
              padding: [3, 4],
              marginTop: [0, 2, 4],
            }}
          >
            <CommentSectionSupabase
              authors={question.author?.id ? [question.author.id] : []}
              setSubscribersCount={setSubscribersCount}
              sourceId={question.id}
              sourceType="questions"
            />
          </Card>
        )}
      </ClientOnly>
    </Flex>
  );
});
