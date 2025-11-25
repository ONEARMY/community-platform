import {
  Category,
  IconCountWithTooltip,
  InternalLink,
  // ModerationStatus,
} from 'oa-components';
import { Highlighter } from 'src/common/Highlighter';
import { Box, Card, Flex, Heading } from 'theme-ui';

import { UserNameTag } from '../common/UserNameTag/UserNameTag';
import { listing } from './labels';

import type { Question } from 'oa-shared';

interface IProps {
  question: Question;
  query?: string;
}

export const QuestionListItem = ({ question, query }: IProps) => {
  const url = `/questions/${encodeURIComponent(question.slug)}`;
  const searchWords = [query || ''];

  return (
    <Card
      as="li"
      data-cy="question-list-item"
      data-id={question.id}
      sx={{
        position: 'relative',
        border: 0,
        overflow: 'hidden',
      }}
    >
      <Flex
        sx={{
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            gap: 1,
            paddingX: 3,
            paddingY: 2,
          }}
        >
          <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
            {/* {moderation !== 'accepted' && (
              <Box>
                <ModerationStatus status={moderation} contentType="question" />
              </Box>
            )} */}

            <Heading
              data-cy="question-list-item-title"
              as="h2"
              sx={{
                color: 'black',
                fontSize: [3, 3, 4],
                marginBottom: 0.5,
              }}
            >
              <InternalLink
                to={url}
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
                <Highlighter searchWords={searchWords} textToHighlight={question.title} />
              </InternalLink>
            </Heading>

            {question.category && <Category category={question.category} sx={{ fontSize: 2 }} />}
          </Flex>

          <Flex>
            {question.author && (
              <UserNameTag
                action="Asked"
                author={question.author}
                createdAt={question.createdAt}
                modifiedAt={question.modifiedAt}
              />
            )}
          </Flex>
        </Flex>

        <Flex
          sx={{
            display: ['none', 'flex', 'flex'],
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
            gap: 12,
            paddingX: 12,
          }}
        >
          <IconCountWithTooltip
            count={question.usefulCount}
            icon="star-active"
            text={listing.usefulness}
          />
          <IconCountWithTooltip
            count={question.commentCount || 0}
            icon="comment"
            text={listing.totalComments}
          />
        </Flex>
      </Flex>

      {query && (
        <Box sx={{ padding: 3, paddingTop: 0 }}>
          <Highlighter searchWords={searchWords} textToHighlight={question.description} />
        </Box>
      )}
    </Card>
  );
};
