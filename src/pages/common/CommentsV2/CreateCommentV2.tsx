import { useState } from 'react'
import { Link } from '@remix-run/react'
import { observer } from 'mobx-react'
import { MemberBadge } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { Box, Button, Flex, Text, Textarea } from 'theme-ui'

export interface Props {
  onSubmit: (value: string) => void
  isLoading?: boolean
  buttonLabel?: string
  placeholder?: string
}

export const CreateCommentV2 = observer((props: Props) => {
  const { onSubmit, isLoading } = props
  const userProfileType = 'member'
  const placeholder = props.placeholder || 'Leave your questions or feedback...'
  const buttonLabel = props.buttonLabel ?? 'Leave a comment'

  const [comment, setComment] = useState<string>('')
  const { userStore } = useCommonStores().stores
  const isLoggedIn = !!userStore.activeUser

  return (
    <Flex
      sx={{
        alignItems: 'stretch',
        background: 'softblue',
        borderRadius: 2,
        flexDirection: 'column',
        padding: 3,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 3 }}>
        <Flex data-target="create-comment-container">
          <Box sx={{ lineHeight: 0, marginTop: 2, display: ['none', 'block'] }}>
            <MemberBadge profileType={userProfileType} useLowDetailVersion />
          </Box>
          <Box
            sx={{
              display: 'block',
              background: 'white',
              flexGrow: 1,
              marginLeft: [2, 5],
              borderRadius: 1,
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                borderWidth: '1em 1em',
                borderStyle: 'solid',
                borderColor: 'transparent white transparent transparent',
                margin: '1em -2em',
              },
            }}
          >
            {!isLoggedIn ? (
              <LoginPrompt />
            ) : (
              <>
                <Textarea
                  value={comment}
                  maxLength={MAX_COMMENT_LENGTH}
                  onChange={(event) => setComment(event.target.value)}
                  aria-label="Comment"
                  placeholder={placeholder}
                  sx={{
                    background: 'none',
                    resize: 'vertical',
                    padding: 3,
                    '&:focus': {
                      borderColor: 'transparent',
                    },
                  }}
                />
                <Text
                  sx={{
                    fontSize: 2,
                    position: 'absolute',
                    right: 0,
                    bottom: -5,
                    pointerEvents: 'none',
                    padding: 1,
                  }}
                >
                  {comment.length}/{MAX_COMMENT_LENGTH}
                </Text>
              </>
            )}
          </Box>
        </Flex>

        <Flex sx={{ alignSelf: 'flex-end' }}>
          <Button
            disabled={!comment.trim() || !isLoggedIn || isLoading}
            variant="primary"
            onClick={() => {
              if (!isLoading) {
                onSubmit(comment)
                setComment('')
              }
            }}
            sx={{ marginTop: isLoggedIn ? 3 : 0 }}
          >
            {isLoading ? 'Loading...' : buttonLabel}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
})

const LoginPrompt = () => {
  return (
    <Box sx={{ padding: [3, 4] }}>
      <Text data-cy="comments-login-prompt">
        Hi there!{' '}
        <Link
          to="/sign-in"
          style={{
            textDecoration: 'underline',
            color: 'inherit',
          }}
        >
          Login
        </Link>{' '}
        to leave a comment
      </Text>
    </Box>
  )
}
