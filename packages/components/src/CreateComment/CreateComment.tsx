import { Link } from 'react-router-dom'
import { Box, Button, Flex, Text, Textarea } from 'theme-ui'

import { MemberBadge } from '../MemberBadge/MemberBadge'

export interface Props {
  maxLength: number
  isLoggedIn: boolean
  isLoading?: boolean
  onSubmit: (value: string) => void
  onChange: (value: string) => void
  comment: string
  placeholder?: string
  userProfileType?: string
  buttonLabel?: string
}

export const CreateComment = (props: Props) => {
  const { comment, isLoggedIn, maxLength, onSubmit, isLoading } = props
  const userProfileType = props.userProfileType || 'member'
  const placeholder = props.placeholder || 'Leave your questions or feedback...'
  const buttonLabel = props.buttonLabel ?? 'Leave a comment'

  const onChange = (newValue: string) => {
    props.onChange && props?.onChange(newValue)
  }

  return (
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
          {isLoggedIn ? (
            <>
              <Textarea
                value={comment}
                maxLength={maxLength}
                onChange={(event) => {
                  onChange && onChange(event.target.value)
                }}
                aria-label="Comment"
                data-cy="comments-form"
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
                {comment.length}/{maxLength}
              </Text>
            </>
          ) : (
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
          )}
        </Box>
      </Flex>

      <Flex sx={{ alignSelf: 'flex-end' }}>
        <Button
          data-cy="comment-submit"
          disabled={!comment.trim() || !isLoggedIn || isLoading}
          variant="primary"
          onClick={() => {
            if (!isLoading) {
              onSubmit(comment)
            }
          }}
          sx={{ marginTop: isLoggedIn ? 3 : 0 }}
        >
          {isLoading ? 'Loading...' : buttonLabel}
        </Button>
      </Flex>
    </Flex>
  )
}
