import { useState } from 'react'
import { Link } from '@remix-run/react'
import { Box, Button, Flex, Image, Text, Textarea } from 'theme-ui'

import sendMobile from '../../assets/icons/contact.svg'
import { MemberBadge } from '../MemberBadge/MemberBadge'

import type { ProfileTypeName } from 'oa-shared'

import './CreateComment.css'

export interface Props {
  maxLength: number
  isLoggedIn: boolean
  isLoading?: boolean
  isReply?: boolean
  onSubmit: (value: string) => void
  onChange: (value: string) => void
  comment: string
  placeholder?: string
  userProfileType?: ProfileTypeName
  buttonLabel?: string
}

export const CreateComment = (props: Props) => {
  const [textareaIsFocussed, setTextareaIsFocussed] = useState<boolean>(false)

  const { comment, isLoggedIn, isReply, maxLength, onSubmit, isLoading } = props
  const userProfileType = props.userProfileType || 'member'
  const placeholder = props.placeholder || 'Leave your questions or feedback...'
  const buttonLabel = props.buttonLabel ?? 'Leave a comment'

  const onChange = (textAreaElement: HTMLTextAreaElement) => {
    ;(textAreaElement.parentNode! as HTMLDivElement).dataset.replicatedValue =
      textAreaElement.value
    props.onChange && props?.onChange(textAreaElement.value)
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 3 }}>
      <Flex data-target="create-comment-container">
        <Box
          sx={{
            lineHeight: 0,
            marginTop: 2,
            display: ['none', 'block'],
            flexShrink: 0,
          }}
        >
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
          {!isLoggedIn ? (
            <LoginPrompt />
          ) : (
            <>
              <div
                className={
                  comment.length > 0 || textareaIsFocussed
                    ? 'grow-wrap value-set'
                    : 'grow-wrap'
                }
              >
                <Textarea
                  value={comment}
                  maxLength={maxLength}
                  onChange={(event) => {
                    onChange && onChange(event.target)
                  }}
                  aria-label="Comment"
                  data-cy={isReply ? 'reply-form' : 'comments-form'}
                  placeholder={placeholder}
                  rows={1}
                  onFocus={() => setTextareaIsFocussed(true)}
                  onBlur={() => setTextareaIsFocussed(false)}
                />
              </div>
              <Text
                sx={{
                  fontSize: 1,
                  display:
                    comment.length > 0 || textareaIsFocussed ? 'block' : 'none',
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none',
                  padding: 1,
                }}
              >
                {comment.length}/{maxLength}
              </Text>
            </>
          )}
        </Box>
        <Flex
          sx={{
            alignSelf: 'flex-end',
            height: ['40px', '52px'],
            width: ['40px', 'auto'],
            marginLeft: 3,
          }}
        >
          <Button
            data-cy={isReply ? 'reply-submit' : 'comment-submit'}
            disabled={!comment.trim() || !isLoggedIn || isLoading}
            variant="primary"
            onClick={() => {
              if (!isLoading) {
                onSubmit(comment)
              }
            }}
            sx={{
              marginTop: isLoggedIn ? 0 : 0,
              height: ['40px', '100%'],
              width: ['40px', 'auto'],
              padding: [0, 1],
            }}
          >
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                <Text
                  sx={{
                    display: ['none', 'block'],
                  }}
                >
                  {buttonLabel}
                </Text>
                <Image
                  src={sendMobile}
                  sx={{
                    display: ['block', 'none'],
                    width: '22px',
                    margin: 'auto',
                  }}
                />
              </>
            )}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

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
