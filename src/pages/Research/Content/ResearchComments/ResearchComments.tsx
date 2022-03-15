import { useState } from 'react'
import ReactGA from 'react-ga'
import { Box, Flex } from 'rebass'
import { useCommonStores } from 'src/index'
import { Button } from 'oa-components'
import Text from 'src/components/Text'
import { CommentTextArea } from 'src/components/Comment/CommentTextArea'
import { IComment } from 'src/models'
import { logger } from 'src/logger'
import { useResearchStore } from 'src/stores/Research/research.store'
import { IResearch } from 'src/models/research.models'
import { CommentList } from 'src/components/CommentList/CommentList'
import styled from '@emotion/styled'

interface IProps {
  comments?: IComment[]
  update: IResearch.UpdateDB
}

const BoxStyled = styled(Box)`
  position: relative;
  border-radius: 5px;
`
const BoxMain = styled(Box)`
  padding-bottom: 15px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
`
const ButtonStyled = styled(Button)`
  float: right;
  margin-top: 1em !important;
`

const ButtonMain = styled(Button)`
  width: 100%;
  justify-content: center;
  &:hover {
    background-color: #c2daf0;
  }
  &:hover.viewComments {
    background-color: #ffffff;
  }
`

export const ResearchComments = ({ comments, update }: IProps) => {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { stores } = useCommonStores()
  const researchStore = useResearchStore()
  const user = stores.userStore.activeUser
  const [viewComments, setViewComments] = useState(false)

  async function onSubmit(comment: string) {
    try {
      setLoading(true)
      await researchStore.addComment(comment, update as IResearch.Update)
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
      {(user || (comments && comments.length > 0)) && (
        <ButtonMain
          variant="subtle"
          fontSize="14px"
          onClick={onButtonClick}
          backgroundColor={viewComments ? '#c2daf0' : '#e2edf7'}
          className={viewComments ? 'viewComments' : ''}
        >
          <Flex>
            <Text>{setButtonText()}</Text>
          </Flex>
        </ButtonMain>
      )}
      {viewComments && (
        <Flex
          mt={5}
          flexDirection="column"
          alignItems="end"
          marginTop="15px"
          data-cy="update-comments"
        >
          <CommentList
            articleTitle={researchStore.activeResearchItem?.title}
            comments={comments}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleEditRequest={handleEditRequest}
          />
          {user ? (
            <BoxStyled width={[7 / 10, 8 / 10, 9 / 10]}>
              <CommentTextArea
                data-cy="comment-text-area"
                comment={comment}
                onChange={setComment}
                loading={loading}
              />
              <ButtonStyled
                data-cy="comment-submit"
                disabled={!Boolean(comment.trim()) || loading}
                variant="primary"
                onClick={() => onSubmit(comment)}
              >
                Comment
              </ButtonStyled>
            </BoxStyled>
          ) : null}
        </Flex>
      )}
    </BoxMain>
  )
}
