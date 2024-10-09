import {
  Category,
  IconCountWithTooltip,
  InternalLink,
  ModerationStatus,
} from 'oa-components'
import { Highlighter } from 'src/common/Highlighter'
import { Box, Card, Flex, Heading } from 'theme-ui'

import { UserNameTag } from '../common/UserNameTag/UserNameTag'
import { listing } from './labels'

import type { IQuestion } from 'oa-shared'

interface IProps {
  question: IQuestion.Item
  query?: string
}

export const QuestionListItem = ({ question, query }: IProps) => {
  const {
    _created,
    _createdBy,
    creatorCountry,
    description,
    moderation,
    questionCategory,
    slug,
    title,
    votedUsefulBy,
  } = question

  const url = `/questions/${encodeURIComponent(slug)}`
  const searchWords = [query || '']

  return (
    <Card
      as="li"
      data-cy="question-list-item"
      data-id={question._id}
      sx={{
        position: 'relative',
        border: 'none',
        borderBottom: '2px solid #cccccc',
        borderRadius: 0,
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
            {moderation !== 'accepted' && (
              <Box>
                <ModerationStatus status={moderation} contentType="question" />
              </Box>
            )}

            <Heading
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
                <Highlighter
                  searchWords={searchWords}
                  textToHighlight={title}
                />
              </InternalLink>
            </Heading>

            {questionCategory && (
              <Category category={questionCategory} sx={{ fontSize: 2 }} />
            )}
          </Flex>

          <Flex>
            <UserNameTag
              userName={_createdBy}
              countryCode={creatorCountry}
              created={_created}
              action="Asked"
            />
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
          <Box>
            <IconCountWithTooltip
              count={(votedUsefulBy || []).length}
              icon="star-active"
              text={listing.usefulness}
            />
          </Box>

          <Box>
            <IconCountWithTooltip
              count={(question as any).commentCount || 0}
              icon="comment"
              text={listing.totalComments}
            />
          </Box>
        </Flex>
      </Flex>

      {query && (
        <Box sx={{ padding: 3 }}>
          <Highlighter
            searchWords={searchWords}
            textToHighlight={description}
          />
        </Box>
      )}
    </Card>
  )
}
