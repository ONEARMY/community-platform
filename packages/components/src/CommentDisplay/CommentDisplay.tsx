import { createRef, useContext, useEffect, useState } from 'react'
import { compareDesc } from 'date-fns'
import { Box, Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { CommentAvatar } from '../CommentAvatar/CommentAvatar'
import { DisplayDate } from '../DisplayDate/DisplayDate'
import { LinkifyText } from '../LinkifyText/LinkifyText'
import { AuthorsContext } from '../providers/AuthorsContext'
import { Username } from '../Username/Username'

import type { Comment } from 'oa-shared'

export interface IProps {
  comment: Comment
  isEditable: boolean | undefined
  itemType: 'ReplyItem' | 'CommentItem'
  setShowDeleteModal: (arg: boolean) => void
  setShowEditModal: (arg: boolean) => void
}

const DELETED_COMMENT = 'The original comment got deleted'
const SHORT_COMMENT = 129

export const CommentDisplay = (props: IProps) => {
  const {
    comment,
    isEditable,
    itemType,
    setShowDeleteModal,
    setShowEditModal,
  } = props
  const textRef = createRef<any>()
  const { authors } = useContext(AuthorsContext)

  const [textHeight, setTextHeight] = useState(0)
  const [isShowMore, setShowMore] = useState(false)

  const maxHeight = isShowMore ? 'max-content' : '128px'

  const showMore = () => {
    setShowMore((prev) => !prev)
  }

  useEffect(() => {
    if (textRef.current) {
      setTextHeight(textRef.current.scrollHeight)
    }
  }, [textRef])

  if (comment.deleted) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          border: `${comment.highlighted ? '2px dashed black' : 'none'}`,
        }}
        data-cy="deletedComment"
      >
        <Text sx={{ color: 'grey' }}>[{DELETED_COMMENT}]</Text>
      </Box>
    )
  }

  if (!comment.deleted) {
    return (
      <Flex
        sx={{
          gap: 2,
          flexGrow: 1,
          border: `${comment.highlighted ? '2px dashed black' : 'none'}`,
        }}
      >
        <Box
          data-cy="commentAvatar"
          data-testid="commentAvatar"
          sx={{
            flexDirection: 'column',
            position: 'relative',
            display: 'inline-block',
          }}
        >
          <CommentAvatar
            name={comment.createdBy?.name}
            photoUrl={comment.createdBy?.photoUrl}
            isCommentAuthor={
              comment.createdBy?.id
                ? authors.includes(comment.createdBy?.id)
                : false
            }
          />
        </Box>

        <Flex
          sx={{
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <Flex
            sx={{
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              flexDirection: ['column', 'row'],
              gap: 2,
            }}
          >
            <Flex
              sx={{
                alignItems: 'baseline',
                gap: 2,
                flexDirection: 'row',
              }}
            >
              <Username
                user={{
                  userName: comment.createdBy?.username || '',
                  countryCode: comment.createdBy?.country,
                  isVerified: comment.createdBy?.isVerified,
                  // TODO: isSupporter
                }}
              />
              <Text sx={{ fontSize: 1, color: 'darkGrey' }}>
                {comment.modifiedAt &&
                  compareDesc(comment.createdAt, comment.modifiedAt) > 0 &&
                  'Edited '}
                <DisplayDate date={comment.modifiedAt || comment.createdAt} />
              </Text>
            </Flex>

            {isEditable && (
              <Flex
                sx={{
                  alignItems: 'flex-end',
                  gap: 2,
                  paddingBottom: 2,
                }}
              >
                <Button
                  type="button"
                  data-cy={`${itemType}: edit button`}
                  variant="subtle"
                  small={true}
                  icon="edit"
                  onClick={() => setShowEditModal(true)}
                >
                  edit
                </Button>
                <Button
                  type="button"
                  data-cy={`${itemType}: delete button`}
                  variant="subtle"
                  small={true}
                  icon="delete"
                  onClick={() => setShowDeleteModal(true)}
                >
                  delete
                </Button>
              </Flex>
            )}
          </Flex>
          <Text
            data-cy="comment-text"
            data-testid="commentText"
            sx={{
              fontFamily: 'body',
              lineHeight: 1.3,
              maxHeight,
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              marginTop: 1,
              marginBottom: 2,
            }}
            ref={textRef}
          >
            <LinkifyText>{comment.comment}</LinkifyText>
          </Text>
          {textHeight > SHORT_COMMENT && (
            <a
              onClick={showMore}
              style={{
                color: 'gray',
                cursor: 'pointer',
              }}
            >
              {isShowMore ? 'Show less' : 'Show more'}
            </a>
          )}
        </Flex>
      </Flex>
    )
  }
}
