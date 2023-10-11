import { Box, Flex } from 'theme-ui'
import { Button, CommentItem, CommentList, CreateComment } from 'oa-components'
import { useState } from 'react'
import { useCommonStores } from 'src'
import type { UserComment } from 'src/models'
import { MAX_COMMENTS } from 'src/constants'
import { trackEvent } from 'src/common/Analytics'
import { logger } from 'src/logger'
import { useDiscussionStore } from 'src/stores/Discussions/discussions.store'

interface Discussion {
  comments: UserComment[]
}

type DiscussionProps = {
  articleTitle?: string
  sourceId: string
  sourceType: string
}

export const Discussion = ({ articleTitle }: DiscussionProps) => {
  const  comments = []

  const { stores } = useCommonStores()

  const discussionStore = useDiscussionStore()
  const [newComment, setNewComment] = useState('')

  const onSubmitComment = async (comment: string) => {
    await discussionStore.addComment(comment, "")

  }
  const handleEditRequest =  async () => {
    trackEvent({
      category: 'Comments',
      action: 'Edit existing comment',
      label: '',
    })
  }

  const handleEdit = async (commentId: string, comment: string) => {
    await discussionStore.editComment(comment, "", commentId)
  }

  const handleReply = async (commentId: string, comment: string) => {
    await discussionStore.addComment(comment, "", commentId)
  }

  const handleDelete = async (commentId: string) => {
    await discussionStore.deleteComment(commentId, "")
  }

  return (
    <Box
      mb={4}
      sx={{
        width: '100%',
        display: 'block',
      }}
    >
      {comments &&
        <CommentList
          articleTitle={articleTitle}
          comments={comments}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleReply={handleReply}
          handleEditRequest={handleEditRequest}
          highlightedCommentId=''
          trackEvent={trackEvent}
          isLoggedIn={!!stores.userStore.activeUser}
        />
      }
      <CreateComment
        maxLength={3000}
        comment={newComment}
        onChange={setNewComment}
        onSubmit={onSubmitComment}
        isLoggedIn={!!stores.userStore.activeUser}
      />
    </Box>
  )
}
