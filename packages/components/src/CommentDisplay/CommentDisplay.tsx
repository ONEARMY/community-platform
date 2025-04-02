import { useContext } from 'react'
import { Box, Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { CommentAvatar } from '../CommentAvatar/CommentAvatar'
import { CommentBody } from '../CommentBody/CommentBody'
import { DisplayDate } from '../DisplayDate/DisplayDate'
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

export const CommentDisplay = (props: IProps) => {
  const {
    comment,
    isEditable,
    itemType,
    setShowDeleteModal,
    setShowEditModal,
  } = props

  const { authors } = useContext(AuthorsContext)

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

        <Flex sx={{ flexDirection: 'column', flex: 1 }}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Flex
              sx={{
                gap: 2,
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <Username
                  user={{
                    userName: comment.createdBy?.username || '',
                    countryCode: comment.createdBy?.country,
                    isVerified: comment.createdBy?.isVerified,
                    // TODO: isSupporter
                  }}
                />
                <Text sx={{ fontSize: 1, color: 'darkGrey' }}>
                  <DisplayDate
                    createdAt={comment.createdAt}
                    modifiedAt={comment.modifiedAt}
                  />
                </Text>
              </Flex>

              {isEditable && (
                <Flex
                  sx={{
                    alignItems: 'flex-end',
                    gap: 2,
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
            <CommentBody body={comment.comment} />
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
