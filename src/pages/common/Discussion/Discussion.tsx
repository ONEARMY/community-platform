import { Box } from 'theme-ui'
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
      label: '',
    })
  }

  const handleEdit = async (commentId: string, comment: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Update',
      label: 'olaaa',
    })
    await discussionStore.editComment(comment, commentId)
  }

  const handleReply = async (commentId: string, comment: string) => {
    await discussionStore.addComment(comment, commentId)
  }

  const handleDelete = async (commentId: string) => {
    await discussionStore.deleteComment(commentId)
    trackEvent({
      category: 'Comments',
      action: 'Deleted',
      label: 'aaaa',
    })
  }

  return (
    <Box
      mb={4}
      sx={{
        width: '100%',
        display: 'block',
      }}
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
      <CreateComment
        maxLength={3000}
        comment={newComment}
        onChange={setNewComment}
        onSubmit={onSubmitComment}
        isLoggedIn={!!userStore.activeUser}
      />
    </Box>
  )
}
