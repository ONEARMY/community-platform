import { useEffect, useMemo, useState } from 'react'
import { Comment } from 'src/models/comment.model'
import { commentService } from 'src/services/commentService'
import { Box, Button, Flex, Heading } from 'theme-ui'

import { CommentItemV2 } from './CommentItemV2'
import { CreateCommentV2 } from './CreateCommentV2'

import type { Reply } from 'src/models/comment.model'

type CommentsV2Props = {
  sourceId: number | string
}
const commentPageSize = 10

const CommentSectionV2 = ({ sourceId }: CommentsV2Props) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newCommentIds, setNewCommentIds] = useState<number[]>([])
  const [commentLimit, setCommentLimit] = useState<number>(commentPageSize)
  const displayedComments = useMemo(() => {
    return comments
      .filter((x) => !newCommentIds.includes(x.id))
      .slice(0, commentLimit)
  }, [comments, commentLimit, newCommentIds])
  const newComments = useMemo(() => {
    return comments.filter((x) => newCommentIds.includes(x.id))
  }, [comments, newCommentIds])
  const displayShowMore = useMemo(
    () => comments.length - newCommentIds.length > commentLimit,
    [comments, commentLimit, newCommentIds],
  )
  const commentCount = useMemo(
    () =>
      comments.filter((x) => !x.deleted).length +
      comments.flatMap((x) => x.replies).filter((x) => !!x).length,
    [comments],
  )

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const result = await fetch(`/api/discussions/${sourceId}/comments`)
        const { comments } = await result.json()
        setComments(comments || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchComments()
  }, [sourceId])

  const postComment = async (comment: string) => {
    try {
      const result = await commentService.postComment(sourceId, comment)

      if (result.status === 201) {
        const newComment = Comment.fromDB(await result.json())

        setComments((comments) => [...comments, newComment])
        setNewCommentIds([...newCommentIds, newComment.id])
      } else {
        // show error
      }
    } catch (err) {
      console.log(err)
    }
  }

  const editComment = async (id: number, comment: string) => {
    try {
      const result = await commentService.editcomment(sourceId, id, comment)

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
        // TODO: show error
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteComment = async (id: number) => {
    try {
      const result = await commentService.deleteComment(sourceId, id)

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
      const result = await commentService.postComment(sourceId, reply, id)

      if (result.status === 201) {
        const newReply = Comment.fromDB(await result.json()) as Reply

        setComments((comments) =>
          comments.map((comment) => {
            if (comment.id === id) {
              comment.replies = [...(comment.replies || []), newReply]
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
      const result = await commentService.editcomment(sourceId, id, replyText)

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
      const result = await commentService.deleteComment(sourceId, id)

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
      {displayedComments.map((comment) => (
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

      {displayShowMore && (
        <Flex>
          <Button
            type="button"
            sx={{ margin: '0 auto' }}
            variant="outline"
            data-cy="show-more-comments"
            onClick={() => setCommentLimit((prev) => prev + commentPageSize)}
          >
            show more comments
          </Button>
        </Flex>
      )}

      {newComments.map((comment) => (
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
