import { useContext } from 'react'
import { Box, Flex, Text } from 'theme-ui'

import { ActionSet } from '../ActionSet/ActionSet'
import { Button } from '../Button/Button'
import { CommentAvatar } from '../CommentAvatar/CommentAvatar'
import { CommentBody } from '../CommentBody/CommentBody'
import { DisplayDate } from '../DisplayDate/DisplayDate'
import { AuthorsContext } from '../providers/AuthorsContext'
import { UsefulButtonLite } from '../UsefulStatsButton/UsefulButtonLite'
import { Username } from '../Username/Username'

import type { Comment } from 'oa-shared'
import type { ReactNode } from 'react'
import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  comment: Comment
  itemType: 'ReplyItem' | 'CommentItem'
  isEditable: boolean | undefined
  setShowDeleteModal: (arg: boolean) => void
  setShowEditModal: (arg: boolean) => void
  usefulButtonConfig: {
    hasUserVotedUseful: boolean
    votedUsefulCount: number
    isLoggedIn: boolean
    onUsefulClick: (
      vote: 'add' | 'delete',
      eventCategory?: string,
    ) => Promise<void>
    sx?: ThemeUIStyleObject
  }
  followButton?: ReactNode
  followButtonIcon?: ReactNode
}

const DELETED_COMMENT = 'The original comment got deleted'

export const CommentDisplay = (props: IProps) => {
  const {
    comment,
    itemType,
    isEditable,
    followButton,
    followButtonIcon,
    setShowDeleteModal,
    setShowEditModal,
    usefulButtonConfig,
  } = props

  const { authors } = useContext(AuthorsContext)
  const border = `${comment.highlighted ? '2px dashed black' : 'none'}`

  if (comment.deleted) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          border,
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
          border,
        }}
        data-cy={comment.highlighted ? 'highlighted-comment' : ''}
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
            photo={comment.createdBy?.photo?.publicUrl}
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
                {comment.createdBy && <Username user={comment.createdBy} />}
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

                <ActionSet itemType={itemType}>
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
            <Flex
              sx={{
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <CommentBody body={comment.comment} />
              <UsefulButtonLite usefulButtonLiteConfig={usefulButtonConfig} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
