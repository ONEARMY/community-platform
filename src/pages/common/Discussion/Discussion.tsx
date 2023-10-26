import { Box, Button, Flex } from 'theme-ui'
import { CommentList, CreateComment } from 'oa-components'
import { useEffect, useState } from 'react'
import { useCommonStores } from 'src'
import { trackEvent } from 'src/common/Analytics'
import type { IDiscussion, UserComment } from 'src/models'

import styled from '@emotion/styled'

const BoxMain = styled(Box)`
  padding-bottom: 15px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  margin-top: 20px;
`

type DiscussionProps = {
  item: any
  articleTitle?: string
  sourceId: string
  discussionBox: boolean
}

export const Discussion = ({
  item,
  sourceId,
  articleTitle,
  discussionBox,
}: DiscussionProps) => {
  const { userStore, discussionStore } = useCommonStores().stores

  const [newComment, setNewComment] = useState('')
  const [viewComments, setViewComments] = useState(false)
  const [discussion, setDiscussion] = useState({} as IDiscussion)
  const [comments, setComments] = useState([] as UserComment[])

  useEffect(() => {
    if (!comments.length) {
      discussionStore.fetchDiscussion(sourceId).then((discussion) => {
        setDiscussion(discussion)
        setComments(discussionStore.formatComments(item, discussion.comments))
      })
    }
  })

  const onSubmitComment = async (comment: string) => {
    discussionStore
      .addComment(discussion, comment)
      .then((discussion: IDiscussion | undefined) => {
        if (discussion)
          setComments(discussionStore.formatComments(item, discussion.comments))
      })
    setNewComment('')
  }

  const handleEditRequest = async () => {
    trackEvent({
      category: 'Comments',
      action: 'Edit existing comment',
      label: `comment:${articleTitle}`,
    })
  }

  const handleEdit = async (commentId: string, comment: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Update',
      label: `comment:${articleTitle}`,
    })
    discussionStore
      .editComment(discussion, comment, commentId)
      .then((discussion: IDiscussion | undefined) => {
        if (discussion)
          setComments(discussionStore.formatComments(item, discussion.comments))
      })
  }

  const handleReply = async (commentId: string, comment: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Reply',
      label: `comment:${articleTitle}`,
    })
    discussionStore
      .addComment(discussion, comment, commentId)
      .then((discussion: IDiscussion | undefined) => {
        if (discussion)
          setComments(discussionStore.formatComments(item, discussion.comments))
      })
  }

  const handleDelete = async (commentId: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Deleted',
      label: `comment:${articleTitle}`,
    })
    discussionStore
      .deleteComment(discussion, commentId)
      .then((discussion: IDiscussion | undefined) => {
        if (discussion)
          setComments(discussionStore.formatComments(item, discussion.comments))
      })
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

  const commentSection = () => {
    return (
      <Flex
        mt={5}
        sx={{ flexDirection: 'column', alignItems: 'end', width: '100%' }}
        data-cy="discussion-comments"
      >
        <CommentList
          articleTitle={articleTitle}
          comments={comments}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleReply={handleReply}
          handleEditRequest={handleEditRequest}
          highlightedCommentId=""
          trackEvent={trackEvent}
          isLoggedIn={!!userStore.activeUser}
        />
        <Box sx={{ width: '100%' }}>
          <CreateComment
            maxLength={3000}
            comment={newComment}
            onChange={setNewComment}
            onSubmit={onSubmitComment}
            isLoggedIn={!!userStore.activeUser}
          />
        </Box>
      </Flex>
    )
  }

  return discussionBox ? (
    <BoxMain backgroundColor={viewComments ? '#e2edf7' : 'inherit'}>
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
      {viewComments && commentSection()}
    </BoxMain>
  ) : (
    commentSection()
  )
}
