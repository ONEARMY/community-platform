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
  sourceType: string
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
  const [totalComments, setTotalComments] = useState(0)

  useEffect(() => {
    if (!Object.keys(discussion).length) {
      discussionStore.fetchDiscussion(sourceId).then((discussion) => {
        if (discussion) {
          setDiscussion(discussion)
          const discussionComments = discussionStore.formatComments(
            item,
            discussion.comments,
            0,
          )
          setComments(discussionComments.comments)
          setTotalComments(discussionComments.count)
        }
      })
    }
  })

  const onSubmitComment = async (comment: string) => {
    const newDiscussion = await discussionStore.addComment(discussion, comment)

    if (newDiscussion) {
      const discussionComments = discussionStore.formatComments(
        item,
        newDiscussion.comments,
        0,
      )
      setComments(discussionComments.comments)
      setTotalComments(discussionComments.count)
      setNewComment('')
    }
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

    const newDiscussion = await discussionStore.editComment(
      discussion,
      comment,
      commentId,
    )

    if (newDiscussion) {
      const discussionComments = discussionStore.formatComments(
        item,
        newDiscussion.comments,
        0,
      )
      setComments(discussionComments.comments)
      setTotalComments(discussionComments.count)
    }
  }

  const handleReply = async (commentId: string, comment: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Reply',
      label: `comment:${articleTitle}`,
    })
    const newDiscussion = await discussionStore.addComment(
      discussion,
      comment,
      commentId,
    )

    if (newDiscussion) {
      const discussionComments = discussionStore.formatComments(
        item,
        newDiscussion.comments,
        0,
      )
      setComments(discussionComments.comments)
      setTotalComments(discussionComments.count)
      setNewComment('')
    }
  }

  const handleDelete = async (commentId: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Deleted',
      label: `comment:${articleTitle}`,
    })
    const newDiscussion = await discussionStore.deleteComment(
      discussion,
      commentId,
    )

    if (newDiscussion) {
      const discussionComments = discussionStore.formatComments(
        item,
        newDiscussion.comments,
        0,
      )
      setComments(discussionComments.comments)
      setTotalComments(discussionComments.count)
    }
  }

  const onButtonClick = () => {
    setViewComments(!viewComments)
  }

  const setButtonText = () => {
    let text = ''
    if (!viewComments) {
      if (comments && totalComments > 0) {
        text = `View ${
          totalComments === 1 ? '1 Comment' : totalComments + ' Comments'
        }`
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
