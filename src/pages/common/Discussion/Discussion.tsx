import { Box, Flex } from 'theme-ui'
import { CommentList, CreateComment } from 'oa-components'
import { useEffect, useState } from 'react'
import { useCommonStores } from 'src'
import { trackEvent } from 'src/common/Analytics'
import type { IDiscussion, UserComment } from 'src/models'
//import { IDiscussion } from 'src/models'
//import { useDiscussionStore } from 'src/stores/Discussions/discussions.store'
//import { logger } from 'src/logger'

type DiscussionProps = {
  item: any
  articleTitle?: string
  sourceId: string
  sourceType: string
  //discussion: IDiscussion
}

export const Discussion = ({sourceId, articleTitle }: DiscussionProps) => {
  const { userStore, discussionStore } = useCommonStores().stores

  const [newComment, setNewComment] = useState('')
  const [discussion, setDiscussion] = useState({} as IDiscussion)
  const [comments, setComments] = useState([] as UserComment[])

  useEffect(()=> {
    if (!comments.length) {
      discussionStore.fetchDiscussion(sourceId).then(discussion => {
        setDiscussion(discussion)
        setComments(discussionStore.formatComments(discussion.comments))
      })
    }
  })

  const onSubmitComment = async (comment: string) => {
    discussionStore.addComment(discussion, comment).then((discussion: IDiscussion | undefined) => {
      if (discussion)
        setComments(discussionStore.formatComments(discussion.comments))
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
    discussionStore.editComment(discussion, comment, commentId).then((discussion: IDiscussion | undefined) => {
      if (discussion)
        setComments(discussionStore.formatComments(discussion.comments))
    })
  }

  const handleReply = async (commentId: string, comment: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Reply',
      label: `comment:${articleTitle}`,
    })
    discussionStore.addComment(discussion, comment, commentId).then((discussion: IDiscussion | undefined) => {
      if (discussion)
        setComments(discussionStore.formatComments(discussion.comments))
    })
  }

  const handleDelete = async (commentId: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Deleted',
      label: `comment:${articleTitle}`,
    })
    discussionStore.deleteComment(discussion, commentId).then((discussion: IDiscussion | undefined) => {
      if (discussion)
        setComments(discussionStore.formatComments(discussion.comments))
    })
  }

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
