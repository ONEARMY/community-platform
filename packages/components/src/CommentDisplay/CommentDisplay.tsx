import { useContext } from 'react'
import { Box, Flex, Text } from 'theme-ui'

import { ActionSet } from '../ActionSet/ActionSet'
import { Button } from '../Button/Button'
import { CommentAvatar } from '../CommentAvatar/CommentAvatar'
import { CommentBody } from '../CommentBody/CommentBody'
import { DisplayDate } from '../DisplayDate/DisplayDate'
import { AuthorsContext } from '../providers/AuthorsContext'
import { Username } from '../Username/Username'

import type { Comment } from 'oa-shared'
import type { ReactNode } from 'react'

export interface IProps {
  comment: Comment
  isEditable: boolean | undefined
  itemType: 'ReplyItem' | 'CommentItem'
  setShowDeleteModal: (arg: boolean) => void
  setShowEditModal: (arg: boolean) => void
  followButton?: ReactNode
  followButtonIcon?: ReactNode
}

const DELETED_COMMENT = 'The original comment got deleted'

export const CommentDisplay = (props: IProps) => {
  const {
    comment,
    isEditable,
    itemType,
    setShowDeleteModal,
    setShowEditModal,
    followButton,
    followButtonIcon,
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
            displayName={comment.createdBy?.displayName}
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
                    showLabel={false}
                  />
                </Text>
              </Flex>

              <Flex>
                {followButtonIcon}

                <ActionSet>
                  {followButton}
                  {isEditable && (
                    <Button
                      type="button"
                      data-cy={`${itemType}: edit button`}
                      variant="subtle"
                      icon="edit"
                      onClick={() => setShowEditModal(true)}
                      sx={{ fontSize: 1 }}
                    >
                      Edit
                    </Button>
                  )}
                  {isEditable && (
                    <Button
                      type="button"
                      data-cy={`${itemType}: delete button`}
                      variant="subtle"
                      icon="delete"
                      onClick={() => setShowDeleteModal(true)}
                      sx={{ fontSize: 1 }}
                    >
                      Delete
                    </Button>
                  )}
                </ActionSet>
              </Flex>
            </Flex>
            <CommentBody body={comment.comment} />
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
