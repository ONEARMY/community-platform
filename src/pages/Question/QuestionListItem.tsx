import { Link } from 'react-router-dom'
import { Category, IconCountWithTooltip, ModerationStatus } from 'oa-components'
import { Highlighter } from 'src/common/Highlighter'
import { Box, Card, Flex, Grid, Heading } from 'theme-ui'

import { UserNameTag } from '../common/UserNameTag/UserNameTag'
import { listing } from './labels'

import type { IQuestion } from 'src/models'

interface IProps {
  question: IQuestion.Item
  query?: string
}

export const QuestionListItem = ({ question, query }: IProps) => {
  const {
    _id,
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
      data-cy="question-list-item"
      sx={{
        marginBottom: 3,
        padding: 3,
        position: 'relative',
      }}
    >
      <Grid columns={[1, '3fr 1fr']}>
        <Box sx={{ flexDirection: 'column' }}>
          <Link to={url} key={_id}>
            <Flex
              sx={{
                width: '100%',
                flexDirection: ['column', 'row'],
                gap: [0, 3],
                mb: [1, 0],
              }}
            >
              <Heading
                as="span"
                sx={{
                  color: 'black',
                  fontSize: [3, 3, 4],
                  marginBottom: 1,
                }}
              >
                <Highlighter
                  searchWords={searchWords}
                  textToHighlight={title}
                />
              </Heading>

              {questionCategory && (
                <Category category={questionCategory} sx={{ fontSize: 2 }} />
              )}
            </Flex>
          </Link>
          <Flex>
            <ModerationStatus
              status={moderation}
              contentType="question"
              sx={{ top: 0, position: 'absolute', right: 0 }}
            />
            <UserNameTag
              userName={_createdBy}
              countryCode={creatorCountry}
              created={_created}
              action="Asked"
            />
          </Flex>
        </Box>
        <Box
          sx={{
            display: ['none', 'flex', 'flex'],
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <IconCountWithTooltip
            count={(votedUsefulBy || []).length}
            icon="star-active"
            text={listing.usefulness}
          />

          <IconCountWithTooltip
            count={(question as any).commentCount || 0}
            icon="comment"
            text={listing.totalComments}
          />
        </Box>
        {query && (
          <Box>
            <Highlighter
              searchWords={searchWords}
              textToHighlight={description}
            />
          </Box>
        )}
      </Grid>
    </Card>
  )
}
