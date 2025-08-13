import { useMemo, useState } from 'react'
import { observer } from 'mobx-react'
import { Button, MemberBadge, ReturnPathLink } from 'oa-components'
import { UserAction } from 'src/common/UserAction'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { Box, Flex, Text, Textarea } from 'theme-ui'

import type { DiscussionContentTypes } from 'oa-shared'
import type { ChangeEvent } from 'react'
import type { ThemeUIStyleObject } from 'theme-ui'

import './CreateCommentSupabase.css'

interface IProps {
  onSubmit: (value: string) => void
  sourceType: DiscussionContentTypes
  isLoading?: boolean
  isReply?: boolean
  placeholder?: string
  sx?: ThemeUIStyleObject | undefined
}

export const CreateCommentSupabase = observer((props: IProps) => {
  const { onSubmit, isLoading, isReply, sx } = props
  const placeholder = props.placeholder || 'Leave your questions or feedback...'
  const buttonLabel = isReply ? 'Leave a reply' : 'Leave a comment'

  const [comment, setComment] = useState<string>('')
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const { profile, profileTypes } = useProfileStore()

  const profileType = useMemo(() => {
    if (profile?.type) {
      return profile.type
    }

    return profileTypes?.find((x) => !x.isSpace)
  }, [profile, profileTypes])

  const commentIsActive = comment.length > 0 || isFocused

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    ;(event.target.parentNode! as HTMLDivElement).dataset.replicatedValue =
      event.target.value
    setComment(event.target.value)
  }

  return (
    <Flex
      sx={{
        alignItems: 'stretch',
        background: 'softblue',
        borderRadius: 2,
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex
          data-target="create-comment-container"
          sx={{ gap: 2, padding: isReply ? 2 : 0 }}
        >
          <Box
            sx={{
              lineHeight: 0,
              display: ['none', 'block'],
              flexShrink: 0,
            }}
          >
            <MemberBadge profileType={profileType} useLowDetailVersion />
          </Box>
          <Box
            sx={{
              display: 'block',
              background: 'white',
              flex: 1,
              marginLeft: [0, 3],
              borderRadius: 1,
              position: 'relative',
              width: 'min-content',
              '&:before': {
                display: ['none', 'block'],
                content: '""',
                position: 'absolute',
                borderWidth: '1em 1em',
                borderStyle: 'solid',
                borderColor: 'transparent white transparent transparent',
                margin: '.5em -2em',
              },
            }}
          >
            <UserAction
              incompleteProfile={<IncompleteProfilePrompt isReply={isReply} />}
              loggedIn={
                <Flex sx={{ flexDirection: 'column' }}>
                  <Box
                    className={`grow-wrap ${commentIsActive ? 'value-set' : ''}`}
                  >
                    <Textarea
                      value={comment}
                      maxLength={MAX_COMMENT_LENGTH}
                      onChange={(event) => onChange(event)}
                      aria-label="Comment"
                      data-cy={isReply ? 'reply-form' : 'comments-form'}
                      placeholder={placeholder}
                      rows={1}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                  </Box>
                  <Text
                    sx={{
                      fontSize: 1,
                      display: commentIsActive ? 'flex' : 'none',
                      alignSelf: 'flex-end',
                      padding: 2,
                    }}
                  >
                    {comment.length}/{MAX_COMMENT_LENGTH}
                  </Text>
                </Flex>
              }
              loggedOut={<LoginPrompt isReply={isReply} />}
            />
          </Box>

          <Flex
            sx={{
              alignSelf: 'flex-end',
              height: ['40px', '52px'],
              width: ['40px', 'auto'],
            }}
          >
            <Button
              data-cy={isReply ? 'reply-submit' : 'comment-submit'}
              disabled={!comment.trim() || isLoading}
              variant="primary"
              icon={isLoading ? undefined : 'contact'}
              onClick={() => {
                if (!isLoading) {
                  onSubmit(comment)
                  setComment('')
                }
              }}
              sx={{
                height: ['40px', '100%'],
                width: ['40px', 'auto'],
                padding: [0, 1],
                'div:first-of-type': {
                  display: ['flex', 'none'],
                },
              }}
            >
              <Text sx={{ display: ['none', 'block'] }}>{buttonLabel}</Text>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
})

const LoginPrompt = ({ isReply }: { isReply?: boolean }) => {
  return (
    <Box sx={{ padding: [3, 4] }}>
      <Text data-cy="comments-login-prompt">
        {isReply ? 'You could reply here.' : 'Hi there!'}{' '}
        <ReturnPathLink
          to="/sign-in"
          style={{
            textDecoration: 'underline',
            color: 'inherit',
          }}
        >
          {isReply
            ? 'But first you need to login'
            : 'Log in to leave a comment'}
        </ReturnPathLink>
      </Text>
    </Box>
  )
}

const IncompleteProfilePrompt = ({ isReply }: { isReply?: boolean }) => {
  return (
    <Box sx={{ padding: [3, 4] }}>
      <Text data-cy="comments-incomplete-profile-prompt">
        {isReply ? 'Before replying' : 'Hi there!'}{' '}
        <ReturnPathLink
          to="/settings"
          style={{
            textDecoration: 'underline',
            color: 'inherit',
          }}
        >
          {isReply
            ? 'complete your profile'
            : 'Complete your profile to leave a comment'}
        </ReturnPathLink>
      </Text>
    </Box>
  )
}
