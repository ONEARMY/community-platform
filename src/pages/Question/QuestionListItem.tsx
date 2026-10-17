import { Category } from 'oa-components';
import type { Question } from 'oa-shared';
import { Link } from 'react-router';
import CheckmarkSuccessIcon from 'src/assets/icons/checkmark-success.svg?react';
import DefaultMemberImage from 'src/assets/images/default_member.svg';
import { Highlighter } from 'src/common/Highlighter';
import { shortFormatNumber } from 'src/utils/helpers';
import { Avatar, Box, Card, Flex, Heading, Text } from 'theme-ui';
import { DisplayDate } from '@/components/ui/display-date';
import CommentIcon from '@/components/ui/icons/comment.svg?react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
          gap: ['10px', '15px', '20px'],
          paddingX: ['10px', '20px', '30px'],
          paddingY: '20px',
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
            width: ['25px', '50px', '50px'],
            height: ['25px', '50px', '50px'],
            flexShrink: 0,
          }}
        />

        <Flex
          sx={{
            flexDirection: 'column',
            gap: 0,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Heading
            data-cy="question-list-item-title"
            as="h2"
            sx={{
              color: 'black',
              fontSize: [3, 4, 4],
            }}
          >
            <Link to={url} className="text-inherit no-underline focus:outline-none">
              <Highlighter searchWords={searchWords} textToHighlight={question.title} />
              <span aria-hidden="true" className="absolute inset-0" />
            </Link>
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
              marginTop: '10px',
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
              {question.acceptedAnswerId && (
                <Tooltip>
                  <TooltipTrigger
                    render={<span tabIndex={0} />}
                    aria-label="Answered"
                    className="inline-flex"
                  >
                    <CheckmarkSuccessIcon width={20} height={20} aria-hidden="true" />
                  </TooltipTrigger>
                  <TooltipContent>Answered</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger
                  render={<span tabIndex={0} />}
                  data-cy="question-list-item-comments"
                  aria-label={`${listing.totalComments}: ${question.commentCount || 0}`}
                  className="inline-flex items-center text-xs text-foreground sm:text-sm"
                >
                  {shortFormatNumber(question.commentCount || 0)}
                  <CommentIcon className="ml-1 size-4" />
                </TooltipTrigger>
                <TooltipContent>{listing.totalComments}</TooltipContent>
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
