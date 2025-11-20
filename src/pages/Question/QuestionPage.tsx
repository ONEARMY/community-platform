import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import {
  Category,
  ContentStatistics,
  ImageGallery,
  LinkifyText,
  TagList,
  UsefulStatsButton,
} from 'oa-components';
import { ClientOnly } from 'remix-utils/client-only';
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs';
import { usefulService } from 'src/services/usefulService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery';
import { buildStatisticsLabel, hasAdminRights } from 'src/utils/helpers';
import { onUsefulClick } from 'src/utils/onUsefulClick';
import { createUsefulStatistic } from 'src/utils/statistics';
import { Box, Button, Card, Divider, Flex, Heading, Text } from 'theme-ui';

import { CommentSectionSupabase } from '../common/CommentsSupabase/CommentSectionSupabase';
import { DraftTag } from '../common/Drafts/DraftTag';
import { UserNameTag } from '../common/UserNameTag/UserNameTag';

import type { ContentType, Question } from 'oa-shared';

interface IProps {
  question: Question;
}

export const QuestionPage = observer(({ question }: IProps) => {
  const { profile: activeUser } = useProfileStore();
  const [voted, setVoted] = useState<boolean>(false);
  const [usefulCount, setUsefulCount] = useState<number>(question.usefulCount);
  const [subscribersCount, setSubscribersCount] = useState<number>(question.subscriberCount);

  useEffect(() => {
    const checkVote = async () => {
      if (activeUser) {
        const hasVoted = await usefulService.hasVoted('questions', question.id);
        setVoted(hasVoted);
      }
    };
    checkVote();
  }, [activeUser, question.id]);

  const isEditable = useMemo(() => {
    return hasAdminRights(activeUser) || question.author?.username === activeUser?.username;
  }, [activeUser, question.author]);

  const configOnUsefulClick = {
    contentType: 'questions' as ContentType,
    contentId: question.id,
    eventCategory: 'QuestionPage',
    slug: question.slug,
    setVoted,
    setUsefulCount,
    loggedInUser: activeUser,
  };

  const handleUsefulClick = async (vote: 'add' | 'delete') => {
    await onUsefulClick({ vote, config: configOnUsefulClick });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
      <Breadcrumbs content={question} variant="question" />
      <Card data-cy="question-body" sx={{ position: 'relative' }} variant="responsive">
        <Flex sx={{ flexDirection: 'column', padding: [3, 4], gap: 3 }}>
          <Flex sx={{ flexWrap: 'wrap', gap: 3 }}>
            <ClientOnly fallback={<></>}>
              {() => (
                <>
                  <UsefulStatsButton
                    votedUsefulCount={usefulCount}
                    hasUserVotedUseful={voted}
                    isLoggedIn={!!activeUser}
                    onUsefulClick={() => handleUsefulClick(voted ? 'delete' : 'add')}
                  />

                  {question.isDraft && <DraftTag />}

                  {isEditable && (
                    <Link to={`/questions/${question.slug}/edit`}>
                      <Button type="button" variant="primary" data-cy="edit">
                        Edit
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </ClientOnly>
          </Flex>

          {question.author && (
            <UserNameTag
              author={question.author}
              createdAt={question.createdAt}
              modifiedAt={question.modifiedAt}
              action="Asked"
            />
          )}

          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            {question.category && <Category category={question.category} />}
            <Heading as="h1" data-cy="question-title" data-testid="question-title">
              {question.title}
            </Heading>

            <Text
              variant="paragraph"
              data-cy="question-description"
              sx={{ whiteSpace: 'pre-line' }}
            >
              <LinkifyText>{question.description}</LinkifyText>
            </Text>

            {question.images && (
              <ImageGallery
                images={formatImagesForGallery(question.images) as any}
                allowPortrait={true}
              />
            )}

            {question.tags && (
              <TagList
                data-cy="question-tags"
                tags={question.tags.map((t) => ({ label: t.name }))}
              />
            )}
          </Flex>
        </Flex>

        <Divider sx={{ m: 0, border: '.5px solid black' }} />

        <ContentStatistics
          statistics={[
            {
              icon: 'show',
              label: buildStatisticsLabel({
                stat: question.totalViews,
                statUnit: 'view',
                usePlural: true,
              }),
              count: question.totalViews,
            },
            {
              icon: 'thunderbolt-grey',
              label: buildStatisticsLabel({
                stat: subscribersCount,
                statUnit: 'following',
                usePlural: false,
              }),
              count: subscribersCount,
            },
            createUsefulStatistic('questions', question.id, usefulCount),
            {
              icon: 'comment-outline',
              label: buildStatisticsLabel({
                stat: question.commentCount,
                statUnit: 'comment',
                usePlural: true,
              }),
              count: question.commentCount,
            },
          ]}
        />
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
    </Box>
  );
});
