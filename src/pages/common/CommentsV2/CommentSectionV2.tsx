import { useEffect, useMemo, useState } from 'react'
import { Comment } from 'src/models/comment.model'
import { auth } from 'src/utils/firebase'
import { Box, Flex, Heading } from 'theme-ui'

import { CommentItemV2 } from './CommentItemV2'
import { CreateCommentV2 } from './CreateCommentV2'

import type { Reply } from 'src/models/comment.model'

type CommentsV2Props = {
  sourceId: number | string
}

const CommentSectionV2 = ({ sourceId }: CommentsV2Props) => {
  const [comments, setComments] = useState<Comment[]>([])
  const commentCount = useMemo(
    () => comments.filter((x) => !x.deleted).length,
    [comments],
  )

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const result = await fetch(`/api/discussions/${sourceId}/comments`)
        const { comments } = await result.json()
        console.log(comments)
        setComments(comments || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchComments()
  }, [sourceId])

  const postComment = async (comment: string) => {
    try {
      const result = await fetch(`/api/discussions/${sourceId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          comment,
          sourceType: 'questions',
        }),
        headers: {
          firebaseToken: await auth.currentUser!.getIdToken(),
        },
      })

      if (result.status === 201) {
        const newComment = Comment.fromDB(await result.json())

        setComments((comments) => [newComment, ...comments])
      } else {
        // show error
      }
    } catch (err) {
      console.log(err)
    }
  }

  const editComment = async (id: number, comment: string) => {
    try {
      const result = await fetch(
        `/api/discussions/${sourceId}/comments/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            comment,
          }),
          headers: {
            firebaseToken: await auth.currentUser!.getIdToken(),
          },
        },
      )

      if (result.status === 204) {
        setComments((comments) =>
          comments.map((x) => {
            if (x.id === id) {
              x.comment = comment
            }
            return x
          }),
        )
      } else {
        // show error
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteComment = async (id: number) => {
    try {
      const result = await fetch(
        `/api/discussions/${sourceId}/comments/${id}`,
        {
          method: 'DELETE',
          headers: {
            firebaseToken: await auth.currentUser!.getIdToken(),
          },
        },
      )

      if (result.status === 204) {
        setComments((comments) =>
          comments.map((x) => {
            if (x.id === id) {
              x.deleted = true
            }
            return x
          }),
        )
      } else {
        // show error
      }
    } catch (err) {
      console.log(err)
    }
  }

  const setTitle = () => {
    if (commentCount === 0) {
      return 'Start the discussion'
    }
    if (commentCount === 1) {
      return '1 Comment'
    }

    return `${commentCount} Comments`
  }

  const title = setTitle()

  const postReply = async (id: number, reply: string) => {
    try {
      const result = await fetch(`/api/discussions/${sourceId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          parentId: id,
          comment: reply,
          sourceType: 'questions',
        }),
        headers: {
          firebaseToken: await auth.currentUser!.getIdToken(),
        },
      })

      if (result.status === 201) {
        const newReply = Comment.fromDB(await result.json()) as Reply

        setComments((comments) =>
          comments.map((comment) => {
            if (comment.id === id) {
              comment.replies = [newReply, ...(comment.replies || [])]
            }
            return comment
          }),
        )
      } else {
        // show error
      }
    } catch (err) {
      console.log(err)
    }
  }

  const editReply = async (id: number, replyText: string, parentId: number) => {
    try {
      const result = await fetch(
        `/api/discussions/${sourceId}/comments/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ comment: replyText }),
          headers: {
            firebaseToken: await auth.currentUser!.getIdToken(),
          },
        },
      )

      if (result.status === 204) {
        setComments((comments) =>
          comments.map((comment) => {
            if (comment.id === parentId) {
              comment.replies = comment.replies?.map((reply) => {
                if (reply.id === id) {
                  reply.comment = replyText
                }
                return reply
              })
            }
            return comment
          }),
        )
      } else {
        // show error
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteReply = async (id: number, parentId: number) => {
    try {
      const result = await fetch(
        `/api/discussions/${sourceId}/comments/${id}`,
        {
          method: 'DELETE',
          headers: {
            firebaseToken: await auth.currentUser!.getIdToken(),
          },
        },
      )

      if (result.status === 204) {
        setComments((comments) =>
          comments.map((comment) => {
            if (comment.id === parentId) {
              comment.replies = comment.replies?.map((reply) => {
                if (reply.id === id) {
                  reply.deleted = true
                }
                return reply
              })
            }
            return comment
          }),
        )
      } else {
        // show error
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <Heading as="h3" data-cy="DiscussionTitle">
        {title}
      </Heading>
      {comments.map((comment) => (
        <Box key={comment.id}>
          <CommentItemV2
            comment={comment}
            onEdit={editComment}
            onDelete={deleteComment}
            onReply={(reply) => postReply(comment.id, reply)}
            onEditReply={(id, reply) => editReply(id, reply, comment.id)}
            onDeleteReply={(id) => deleteReply(id, comment.id)}
          />
        </Box>
      ))}

      <CreateCommentV2 onSubmit={postComment} />
    </Flex>
  )
}

export default CommentSectionV2
