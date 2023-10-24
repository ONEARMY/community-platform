import { Box, Flex } from 'theme-ui'
import { CommentList, CreateComment } from 'oa-components'
import { useState } from 'react'
import { useCommonStores } from 'src'
import { trackEvent } from 'src/common/Analytics'
//import { useDiscussionStore } from 'src/stores/Discussions/discussions.store'
//import { logger } from 'src/logger'

type DiscussionProps = {
  item: any
  articleTitle?: string
  sourceId: string
  sourceType: string
}

export const Discussion = ({ articleTitle }: DiscussionProps) => {
  const { userStore, discussionStore } = useCommonStores().stores

  const [newComment, setNewComment] = useState('')

  const onSubmitComment = async (comment: string) => {
    await discussionStore.addComment(comment)
    setNewComment('')
  }

  const handleEditRequest =  async () => {
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
    await discussionStore.editComment(comment, commentId)
  }

  const handleReply = async (commentId: string, comment: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Reply',
      label: `comment:${articleTitle}`,
    })
    await discussionStore.addComment(comment, commentId)
  }

  const handleDelete = async (commentId: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Deleted',
      label: `comment:${articleTitle}`,
    })
    await discussionStore.deleteComment(commentId)
  }

  return (
    <Flex
        mt={5}
        sx={{ flexDirection: 'column', alignItems: 'end', width: '100%' }}
        data-cy="discussion-comments"
      >
      <CommentList
        articleTitle={articleTitle}
        comments={discussionStore.discussionComments}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleReply={handleReply}
        handleEditRequest={handleEditRequest}
        highlightedCommentId=''
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
