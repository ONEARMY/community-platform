import { useEffect, useMemo, useState } from 'react'
import { AuthorsContext, CommentsTitle } from 'oa-components'
import { Comment, UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { FollowButtonAction } from 'src/common/FollowButtonAction'
import { commentService } from 'src/services/commentService'
import { subscribersService } from 'src/services/subscribersService'
import { Box, Button, Flex } from 'theme-ui'

import { CommentItemSupabase } from './CommentItemSupabase'
import { CreateCommentSupabase } from './CreateCommentSupabase'

import type { DiscussionContentTypes, Reply } from 'oa-shared'
import type { Dispatch, SetStateAction } from 'react'

interface IProps {
  authors: Array<number>
  sourceId: number
  sourceType: DiscussionContentTypes
  setSubscribersCount?: Dispatch<SetStateAction<number>>
}
const commentPageSize = 10

export const CommentSectionSupabase = (props: IProps) => {
  const { authors, setSubscribersCount, sourceId, sourceType } = props
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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await commentService.getComments(sourceType, sourceId)
        const highlightedCommentId = location.hash.replace('#comment:', '')

        if (highlightedCommentId) {
          const highlightedComment = comments.find(
            (x) => x.id === +highlightedCommentId,
          )
          if (highlightedComment) {
            highlightedComment.highlighted = true
          } else {
            // find in replies and set highlighted
            const highlightedReply = comments
              .flatMap((x) => x.replies)
              .find((x) => x?.id === +highlightedCommentId)

            if (highlightedReply) {
              highlightedReply.highlighted = true
            }
          }

          // ensure highlighted comment is visible
          const index = comments.findIndex(
            (x) => x.highlighted || x.replies?.some((y) => y.highlighted),
          )

          if (index > 5) {
            setCommentLimit(index + 1)
          }
        }

        setComments(comments || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchComments()
  }, [sourceId, location?.hash])

  const postComment = async (comment: string) => {
    try {
      const result = await commentService.postComment(
        sourceId,
        comment,
        sourceType,
      )

      if (result.status === 201) {
        const newComment = Comment.fromDB(await result.json())
        subscribersService.add(
          newComment.sourceType,
          Number(newComment.sourceId),
        )

        setComments((comments) => [...comments, newComment])
        setNewCommentIds([...newCommentIds, newComment.id])
      } else {
        // show error
      }
    } catch (err) {
      console.error(err)
    }
  }

  const editComment = async (id: number, comment: string) => {
    try {
      const result = await commentService.editcomment(sourceId, id, comment)
      const now = new Date()

      if (result.status === 204) {
        setComments((comments) =>
          comments.map((x) => {
            if (x.id === id) {
              x.comment = comment
              x.modifiedAt = now
            }
            return x
          }),
        )
      } else {
        // TODO: show error
      }
    } catch (err) {
      console.error(err)
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
      console.error(err)
    }
  }

  const postReply = async (id: number, reply: string) => {
    try {
      const result = await commentService.postComment(
        sourceId,
        reply,
        sourceType,
        id,
      )

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
      console.error(err)
    }
  }

  const editReply = async (id: number, replyText: string, parentId: number) => {
    try {
      const result = await commentService.editcomment(sourceId, id, replyText)
      const now = new Date()

      if (result.status === 204) {
        setComments((comments) =>
          comments.map((comment) => {
            if (comment.id === parentId) {
              comment.replies = comment.replies?.map((reply) => {
                if (reply.id === id) {
                  reply.comment = replyText
                  reply.modifiedAt = now
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
      console.error(err)
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
      console.error(err)
    }
  }

  return (
    <AuthorsContext.Provider value={{ authors }}>
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <CommentsTitle comments={comments} />
          <AuthWrapper
            roleRequired={[
              UserRole.BETA_TESTER,
              UserRole.RESEARCH_CREATOR,
              UserRole.ADMIN,
            ]}
          >
            <FollowButtonAction
              labelFollow="Follow Comments"
              labelUnfollow="Following Comments"
              contentType={sourceType}
              itemId={sourceId}
              setSubscribersCount={setSubscribersCount}
            />
          </AuthWrapper>
        </Flex>
        {displayedComments.map((comment) => (
          <Box key={comment.id}>
            <CommentItemSupabase
              comment={comment}
              onEdit={editComment}
              onDelete={deleteComment}
              onReply={(reply) => postReply(comment.id, reply)}
              onEditReply={(id, reply) => editReply(id, reply, comment.id)}
              onDeleteReply={(id) => deleteReply(id, comment.id)}
              sourceType={sourceType}
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
            <CommentItemSupabase
              comment={comment}
              onEdit={editComment}
              onDelete={deleteComment}
              onReply={(reply) => postReply(comment.id, reply)}
              onEditReply={(id, reply) => editReply(id, reply, comment.id)}
              onDeleteReply={(id) => deleteReply(id, comment.id)}
              sourceType={sourceType}
            />
          </Box>
        ))}

        <CreateCommentSupabase onSubmit={postComment} sourceType={sourceType} />
      </Flex>
    </AuthorsContext.Provider>
  )
}
