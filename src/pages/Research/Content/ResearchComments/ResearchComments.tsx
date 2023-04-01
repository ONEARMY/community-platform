import { Button, CommentList, CreateComment } from 'oa-components'
import { useState } from 'react'
import { MAX_COMMENT_LENGTH } from '../../../../constants'
import { useCommonStores } from '../../../../'
import { logger } from 'src/logger'
import { useResearchStore } from '../../../../stores/Research/research.store'
import { Box, Flex } from 'theme-ui'

import styled from '@emotion/styled'

import type { UserComment } from 'src/models'
import type { IResearch } from 'src/models/research.models'
import { trackEvent } from 'src/common/Analytics'
interface IProps {
  comments: UserComment[]
  update: IResearch.UpdateDB
  updateIndex: number
  showComments?: boolean
}

const BoxMain = styled(Box)`
  padding-bottom: 15px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
`

export const getResearchCommentId = (s: string) =>
  s.replace(/#update-\d+-comment:/, '')

export const ResearchComments = ({
  comments,
  update,
  showComments,
}: IProps) => {
  const [comment, setComment] = useState('')
  const [, setLoading] = useState(false)
  const researchStore = useResearchStore()
  const [viewComments, setViewComments] = useState(!!showComments)
  const { stores } = useCommonStores()

  const onSubmit = async (comment: string) => {
    try {
      setLoading(true)
      await researchStore.addComment(comment, update as IResearch.Update)
      setLoading(false)
      setComment('')

      trackEvent({
        category: 'Comments',
        action: 'Submitted',
        label: researchStore.activeResearchItem?.title,
      })
      logger.debug(
        {
          category: 'Comments',
          action: 'Submitted',
          label: researchStore.activeResearchItem?.title,
        },
        'comment submitted',
      )
    } catch (err) {
      // Error: Comment could not be posted
      logger.error({ err }, 'failed to submit comment')
    }
  }

  const handleEditRequest = async () => {
    trackEvent({
      category: 'Comments',
      action: 'Edit existing comment',
      label: researchStore.activeResearchItem?.title,
    })
  }

  const handleDelete = async (_id: string) => {
    await researchStore.deleteComment(_id, update as IResearch.Update)
    trackEvent({
      category: 'Comments',
      action: 'Deleted',
      label: researchStore.activeResearchItem?.title,
    })
    logger.debug(
      {
        category: 'Comments',
        action: 'Deleted',
        label: researchStore.activeResearchItem?.title,
      },
      'comment deleted',
    )
  }

  const handleEdit = async (_id: string, comment: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Update',
      label: researchStore.activeResearchItem?.title,
    })
    logger.debug(
      {
        category: 'Comments',
        action: 'Update',
        label: researchStore.activeResearchItem?.title,
      },
      'comment edited',
    )
    await researchStore.editComment(_id, comment, update)
  }

  const onButtonClick = () => {
    setViewComments(!viewComments)
  }

  const setButtonText = () => {
    let text = ''
    if (!viewComments) {
      if (comments && comments.length > 0) {
        text =
          comments.length === 1
            ? `View 1 Comment`
            : `View ${comments.length} Comments`
      } else {
        text = 'Start a discussion'
      }
    } else {
      text = 'Collapse Comments'
    }
    return text
  }

  return (
    <BoxMain
      paddingTop={viewComments ? '15px' : '0'}
      paddingLeft={viewComments ? '25px' : '0'}
      paddingRight={viewComments ? '25px' : '0'}
      backgroundColor={viewComments ? '#e2edf7' : 'inherit'}
      marginBottom={viewComments ? '20px' : '0'}
    >
      <Button
        variant="subtle"
        sx={{
          fontSize: '14px',
          width: '100%',
          textAlign: 'center',
          display: 'block',
        }}
        onClick={onButtonClick}
        backgroundColor={viewComments ? '#c2daf0' : '#e2edf7'}
        className={viewComments ? 'viewComments' : ''}
        data-cy={
          !viewComments
            ? 'ResearchComments: button open-comments'
            : 'ResearchComments: button'
        }
      >
        <>{setButtonText()}</>
      </Button>
      {viewComments && (
        <Flex
          mt={5}
          sx={{ flexDirection: 'column', alignItems: 'end' }}
          marginTop="15px"
          data-cy="update-comments"
        >
          <CommentList
            articleTitle={researchStore.activeResearchItem?.title}
            comments={comments}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleEditRequest={handleEditRequest}
            highlightedCommentId={getResearchCommentId(window.location.hash)}
            trackEvent={trackEvent}
          />
          <Box sx={{ width: '100%' }}>
            <CreateComment
              maxLength={MAX_COMMENT_LENGTH}
              comment={comment}
              onChange={setComment}
              onSubmit={onSubmit}
              isLoggedIn={!!stores.userStore.activeUser}
            />
          </Box>
        </Flex>
      )}
    </BoxMain>
  )
}
