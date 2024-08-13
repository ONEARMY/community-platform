import { PrimaryContentListItem } from 'oa-components'
import { Highlighter } from 'src/common/Highlighter'
import { Box } from 'theme-ui'

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
    <PrimaryContentListItem
      dataCy="question-list-item"
      link={url}
      title={title}
      category={questionCategory}
      creator={
        <UserNameTag
          action="Asked"
          date={_created}
          countryCode={creatorCountry}
          userName={_createdBy}
        />
      }
      moderationStatusProps={{ status: moderation, contentType: 'question' }}
      additionalFooterContent={
        query && (
          <Box sx={{ padding: 3 }}>
            <Highlighter
              searchWords={searchWords}
              textToHighlight={description}
            />
          </Box>
        )
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
