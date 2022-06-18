import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { Box, Flex } from 'theme-ui'
import { Button, CreateComment } from 'oa-components'
import type { IComment } from 'src/models'
import { logger } from 'src/logger'
import { useResearchStore } from 'src/stores/Research/research.store'
import type { IResearch } from 'src/models/research.models'
import { CommentList } from 'src/components/CommentList/CommentList'
import { useCommonStores } from 'src/index'
import styled from '@emotion/styled'
import { MAX_COMMENT_LENGTH } from 'src/constants'

interface IProps {
  comments?: IComment[]
  update: IResearch.UpdateDB
  updateIndex: number
  commentToScrollTo: string
}

const BoxMain = styled(Box)`
  padding-bottom: 15px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
`

export const ResearchComments = ({
  comments,
  update,
  updateIndex,
  commentToScrollTo,
}: IProps) => {
  const [comment, setComment] = useState('')
  const [, setLoading] = useState(false)
  const researchStore = useResearchStore()
  const [viewComments, setViewComments] = useState(false)
  const { stores } = useCommonStores()

  useEffect(() => {
    if (comments?.some((comment) => comment._id == commentToScrollTo)) {
      setViewComments(true)
    }
  }, [commentToScrollTo])

  async function onSubmit(comment: string) {
    try {
      setLoading(true)
      await researchStore.addComment(
        comment,
        update as IResearch.Update,
        updateIndex,
      )
      setLoading(false)
      setComment('')

      ReactGA.event({
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

  async function handleEditRequest() {
    ReactGA.event({
      category: 'Comments',
      action: 'Edit existing comment',
      label: researchStore.activeResearchItem?.title,
    })
  }

  async function handleDelete(_id: string) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this comment?',
    )
    if (confirmation) {
      await researchStore.deleteComment(_id, update as IResearch.Update)
      ReactGA.event({
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
  }

  async function handleEdit(_id: string, comment: string) {
    ReactGA.event({
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
        data-cy={!viewComments ? 'open-comments' : ''}
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
            commentToScrollTo={commentToScrollTo}
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
