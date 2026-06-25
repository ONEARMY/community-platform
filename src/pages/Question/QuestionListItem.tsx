import {
  Category,
  DisplayDate,
  IconCountWithTooltip,
  InternalLink,
  // ModerationStatus,
} from 'oa-components';
import type { Question } from 'oa-shared';
import DefaultMemberImage from 'src/assets/images/default_member.svg';
import { Highlighter } from 'src/common/Highlighter';
import { Avatar, Box, Card, Flex, Heading, Text } from 'theme-ui';
import { listing } from './labels';

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
        borderRadius: 0,
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: ['10px', '20px', '40px'],
          right: ['10px', '20px', '40px'],
          borderBottom: '2px solid #CCCCCC',
          pointerEvents: 'none',
        },
        '&:last-of-type::after': {
          display: 'none',
        },
      }}
    >
      <Flex
        sx={{
          gap: '20px',
          padding: '30px',
        }}
      >
        <Avatar
          data-cy="question-list-item-avatar"
          src={question.author?.photo?.publicUrl ?? DefaultMemberImage}
          alt={
            question.author ? `Avatar of ${question.author.username}` : 'Avatar of question author'
          }
          loading="lazy"
          sx={{
            objectFit: 'cover',
            width: '50px',
            height: '50px',
            flexShrink: 0,
          }}
        />

        <Flex
          sx={{
            flexDirection: 'column',
            gap: 1,
            flex: 1,
            minWidth: 0,
          }}
        >
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

          {question.description && (
            <Text
              data-cy="question-list-item-description"
              sx={{
                color: 'grey',
                fontSize: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontFamily: 'body',
                lineHeight: '1.5',
              }}
            >
              <Highlighter searchWords={searchWords} textToHighlight={question.description} />
            </Text>
          )}

          <Flex
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              marginTop: 1,
            }}
          >
            {question.category ? (
              <Category category={question.category} sx={{ fontSize: 1 }} />
            ) : (
              <Box />
            )}

            <Flex sx={{ alignItems: 'center', gap: 2, position: 'relative' }}>
              <Text variant="auxiliary">
                <DisplayDate
                  publishedAction="Asked"
                  createdAt={question.createdAt}
                  publishedAt={question.publishedAt}
                />
              </Text>
              <IconCountWithTooltip
                count={question.commentCount || 0}
                icon="comment"
                text={listing.totalComments}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
