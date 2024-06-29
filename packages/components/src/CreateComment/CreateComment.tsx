import { Link } from 'react-router-dom'
import { TextareaAutosize } from '@mui/base'
import { Box, Flex, IconButton, Text } from 'theme-ui'

import { Icon } from '../Icon/Icon'
import { MemberBadge } from '../MemberBadge/MemberBadge'

export interface Props {
  maxLength: number
  isLoggedIn: boolean
  isMobile?: boolean
  isLoading?: boolean
  isReply?: boolean
  onSubmit: (value: string) => void
  onChange: (value: string) => void
  comment: string
  placeholder?: string
  userProfileType?: string
  buttonLabel?: string
}

export const CreateComment = (props: Props) => {
  const { comment, isLoggedIn, isReply, maxLength, onSubmit, isLoading } = props
  const userProfileType = props.userProfileType || 'member'
  const placeholder = props.placeholder || 'Leave your questions or feedback...'
  const buttonLabel = props.buttonLabel ?? 'Leave a comment'

  const onChange = (newValue: string) => {
    props.onChange && props?.onChange(newValue)
  }

  return (
    <Flex sx={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Flex data-target="create-comment-container" sx={{ flex: 1 }}>
        {!props.isMobile && (
          <MemberBadge
            size={45}
            style={{ alignSelf: 'flex-start' }}
            profileType={userProfileType}
            useLowDetailVersion
          />
        )}
        <Box
          sx={{
            display: 'block',
            background: 'white',
            flexGrow: 1,
            borderRadius: 1,
            position: 'relative',
            ...(props.isMobile
              ? {}
              : {
                  marginLeft: [2, 5],
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    borderWidth: '1em 1em',
                    borderStyle: 'solid',
                    borderColor: 'transparent white transparent transparent',
                    top: '0.5em',
                    left: '-2em',
                  },
                }),
          }}
        >
          {isLoggedIn ? (
            <>
              <TextareaAutosize
                value={comment}
                maxLength={maxLength}
                onChange={(event) => {
                  onChange && onChange(event.target.value)
                }}
                aria-label="Comment"
                data-cy={isReply ? 'reply-form' : 'comments-form'}
                placeholder={placeholder}
                minRows={1}
                style={{
                  width: '100%',
                  background: 'none',
                  padding: '15px 10px 10px 10px',
                  resize: 'none',
                  border: 'none',
                  outline: 'none',
                }}
              />
              {/*<Text*/}
              {/*    sx={{*/}
              {/*      fontSize: 2,*/}
              {/*      position: 'absolute',*/}
              {/*      right: 0,*/}
              {/*      bottom: -5,*/}
              {/*      pointerEvents: 'none',*/}
              {/*      padding: 1,*/}
              {/*    }}*/}
              {/*>*/}
              {/*  {comment.length}/{maxLength}*/}
              {/*</Text>*/}
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

      <IconButton
        data-cy={isReply ? 'reply-submit' : 'comment-submit'}
        disabled={!comment.trim() || !isLoggedIn || isLoading}
        variant="primary"
        sx={{ alignSelf: 'flex-end' }}
        onClick={() => {
          if (!isLoading) {
            onSubmit(comment)
          }
        }}
      >
        {props.isMobile ? (
          <Icon size={30} glyph="send" />
        ) : (
          <Text>{isLoading ? 'Loading...' : buttonLabel}</Text>
        )}
      </IconButton>
    </Flex>
  )
}
