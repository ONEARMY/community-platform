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

  const onChange = ({ parentNode, value }: HTMLTextAreaElement) => {
    ;(parentNode! as HTMLDivElement).dataset.replicatedValue = value
    props?.onChange(value)
  }

  const commentIsActive = comment.length > 0 || textareaIsFocussed
  const onClick = () => {
    !isLoading && onSubmit(comment)
  }

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex data-target="create-comment-container" sx={{ gap: 2 }}>
        <Box
          sx={{
            lineHeight: 0,
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
          {!isLoggedIn && <LoginPrompt />}
          {isLoggedIn && (
            <Flex sx={{ flexDirection: 'column' }}>
              <Box
                className={`grow-wrap ${commentIsActive ? 'value-set' : ''}`}
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
              </Box>
              <Text
                sx={{
                  fontSize: 1,
                  display: commentIsActive ? 'flex' : 'none',
                  alignSelf: 'flex-end',
                  padding: 2,
                }}
              >
                {comment.length}/{maxLength}
              </Text>
            </Flex>
          )}
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
            data-testid="send-comment-button"
            disabled={!comment.trim() || !isLoggedIn || isLoading}
            variant="primary"
            onClick={onClick}
            sx={{
              height: ['40px', '100%'],
              width: ['40px', 'auto'],
              padding: [0, 1],
            }}
          >
            {isLoading && 'Loading...'}
            {!isLoading && (
              <>
                <Text sx={{ display: ['none', 'block'] }}>{buttonLabel}</Text>
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
        <Link
          to="/sign-in"
          style={{
            textDecoration: 'underline',
            color: 'inherit',
          }}
        >
          Hi there! Login to leave a comment
        </Link>
      </Text>
    </Box>
  )
}
