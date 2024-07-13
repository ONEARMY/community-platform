import { ResponsiveCard } from 'oa-components'
import { Highlighter } from 'src/common/Highlighter'
import { Box, Flex } from 'theme-ui'

import { UserNameTag } from '../common/UserNameTag/UserNameTag'
import { listing } from './labels'

import type { IQuestion } from 'src/models'

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
    <ResponsiveCard
      dataCy="question-list-item"
      dataId={question._id}
      link={url}
      title={title}
      titleAs="h2"
      category={questionCategory}
      moderationStatusProps={{ status: moderation, contentType: 'question' }}
      additionalFooterContent={
        <Flex sx={{ flexDirection: 'column', flex: 1 }}>
          <UserNameTag
            userName={_createdBy}
            countryCode={creatorCountry}
            created={_created}
            action="Asked"
          />
          {query && (
            <Box sx={{ padding: 3 }}>
              <Highlighter
                searchWords={searchWords}
                textToHighlight={description}
              />
            </Box>
          )}
        </Flex>
      }
      iconCounts={[
        {
          count: (votedUsefulBy || []).length,
          icon: 'star-active',
          text: listing.usefulness,
        },
        {
          count: question.commentCount || 0,
          icon: 'comment',
          text: listing.totalComments,
        },
      ]}
    />
  )
}
