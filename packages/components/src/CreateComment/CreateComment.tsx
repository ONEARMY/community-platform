import { Link } from '@remix-run/react'
import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Text,
  Textarea,
  useThemeUI,
} from 'theme-ui'

import sendMobile from '../../assets/icons/contact.svg'
import { MemberBadge } from '../MemberBadge/MemberBadge'

import type { ProfileTypeName } from 'oa-shared'
import type { ThemeUIStyleObject } from 'theme-ui'

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

type ScreenSizePercent = {
  screenWidthBigger: number
  targetSize: number
  buffer: number
  screenWidthSmaller?: number
}

export const CreateComment = (props: Props) => {
  const { theme } = useThemeUI() as any
  const { comment, isLoggedIn, isReply, maxLength, onSubmit, isLoading } = props
  const userProfileType = props.userProfileType || 'member'
  const placeholder = props.placeholder || 'Leave your questions or feedback...'
  const buttonLabel = props.buttonLabel ?? 'Leave a comment'
  const screenSizePercents: ScreenSizePercent[] = [
    // Values acquired by excessive Testing
    {
      screenWidthBigger: 1300,
      targetSize: 306,
      buffer: 0,
    },
    {
      screenWidthBigger: 1120,
      screenWidthSmaller: 1300,
      targetSize: 204,
      buffer: -1,
    },
    {
      screenWidthBigger: 830,
      screenWidthSmaller: 1120,
      targetSize: 209,
      buffer: 100,
    },
    {
      screenWidthBigger: 675,
      screenWidthSmaller: 830,
      targetSize: 146,
      buffer: 15,
    },
    {
      screenWidthBigger: 640,
      screenWidthSmaller: 675,
      targetSize: 106,
      buffer: 70,
    },
    // Smaller 640 is Mobile
    {
      screenWidthBigger: 550,
      screenWidthSmaller: 640,
      targetSize: 241,
      buffer: 0,
    },
    {
      screenWidthBigger: 450,
      screenWidthSmaller: 550,
      targetSize: 136,
      buffer: 30,
    },
    {
      screenWidthBigger: 0,
      screenWidthSmaller: 450,
      targetSize: 75,
      buffer: 55,
    },
  ]

  const onChange = (eventElement: any) => {
    props.onChange && props.onChange(eventElement.value)
  }

  let rows = 0
  const newLineCharacterMax: ScreenSizePercent | undefined =
    screenSizePercents.find(
      (size) =>
        size.screenWidthBigger <= screen.width &&
        (size.screenWidthSmaller === undefined ||
          size.screenWidthSmaller > screen.width),
    )
  const isMobileView: boolean = screen.width < 640
  if (!newLineCharacterMax) {
    console.error(
      new Error(
        'There is no specified Screensize for Screen! Our HTML will break!',
      ),
    )
  }
  const commentSplitByNewLineChars: string[] = comment.split(/\r\n|\r|\n/g)
  // Add row for every new line and when line excedes calculateded character limit
  rows = commentSplitByNewLineChars.length
  let buffer: number = 0
  commentSplitByNewLineChars.forEach((textWithoutLineBreaks) => {
    const rowsToAdd: number = Math.floor(
      getTextWidth(textWithoutLineBreaks) /
        (newLineCharacterMax!.targetSize! + buffer),
    )
    if (rowsToAdd > 0) {
      // Values acquired by excessive Testing
      if (rowsToAdd > 2 && rowsToAdd <= 5) {
        rows += rowsToAdd * 0.9
      } else if (rowsToAdd > 5 && newLineCharacterMax!.buffer > 0) {
        rows += rowsToAdd * 0.7
      } else if (newLineCharacterMax!.buffer === 0) {
        rows += rowsToAdd * 0.85
      } else if (newLineCharacterMax!.buffer === -1) {
        rows += rowsToAdd * 0.75
      } else {
        rows += rowsToAdd
      }
      buffer += newLineCharacterMax!.buffer
    }
  })

  // Style
  const textareaGrew: boolean = rows > 1
  const sxCommentCount: ThemeUIStyleObject = textareaGrew
    ? {
        fontSize: 2,
        right: 0,
        pointerEvents: 'none',
        padding: 1,
        paddingBottom: 0,
        color: theme.colors.lightgrey,
        position: 'absolute',
        bottom: 0,
      }
    : {
        fontSize: 2,
        right: 0,
        alignSelf: 'center',
        pointerEvents: 'none',
        padding: 1,
        paddingLeft: '15px',
        paddingRight: '15px',
        color: theme.colors.lightgrey,
      }
  const sxGridTexarea: ThemeUIStyleObject = textareaGrew
    ? {}
    : {
        gridTemplateColumns: '1fr auto',
        gap: 0,
      }

  const sxCommentButton: ThemeUIStyleObject = textareaGrew
    ? {
        height: isMobileView ? '40px' : '45px',
        width: isMobileView ? '40px' : 'auto',
        marginLeft: '15px',
        position: 'absolute',
        fontSize: '16px',
        bottom: 0,
        right: 0,
        transition: 'none',
        padding: isMobileView ? 0 : '10px 15px',
      }
    : {
        marginTop: 0,
        height: isMobileView ? '40px' : '100%',
        width: isMobileView ? '40px' : 'auto',
        fontSize: '16px',
        marginLeft: '15px',
        transition: 'none',
        padding: isMobileView ? 0 : '10px 15px',
      }
  const sxTextarea: ThemeUIStyleObject = {
    background: 'none',
    resize: 'none',
    padding: isMobileView
      ? `10px 10px ${textareaGrew ? '13px' : '10px'} 10px`
      : `15px 15px ${textareaGrew ? '17px' : '15px'} 15px`,
    fontSize: '12px',
    overflow: 'hidden',
    '&:focus': {
      borderColor: 'transparent',
    },
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 3 }}>
      <Grid
        data-target="create-comment-container"
        sx={{
          gridTemplateColumns: ['1fr auto', '40px 1fr auto'],
          gridTemplateRows: '1fr',
          gap: 0,
          position: 'relative',
        }}
      >
        <Box sx={{ lineHeight: 0, marginTop: 1, display: ['none', 'block'] }}>
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
              display: ['none', 'block'],
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
            <Grid sx={sxGridTexarea}>
              <Textarea
                value={comment}
                maxLength={maxLength}
                onChange={(event) => {
                  onChange && onChange(event.target)
                }}
                aria-label="Comment"
                data-cy={isReply ? 'reply-form' : 'comments-form'}
                placeholder={placeholder}
                rows={rows}
                sx={sxTextarea}
              />
              <Text sx={sxCommentCount}>
                {comment.length}/{maxLength}
              </Text>
            </Grid>
          )}
        </Box>

        {textareaGrew && (
          <Grid
            sx={{
              width: isMobileView ? '55px' : '200px',
            }}
          ></Grid>
        )}
        <Button
          data-cy={isReply ? 'reply-submit' : 'comment-submit'}
          disabled={!comment.trim() || !isLoggedIn || isLoading}
          variant="primary"
          onClick={() => {
            if (!isLoading) {
              onSubmit(comment)
            }
          }}
          sx={sxCommentButton}
        >
          {isLoading ? (
            'Loading...'
          ) : !isMobileView ? (
            buttonLabel
          ) : (
            <Image src={sendMobile} sx={{ width: '22px', margin: 'auto' }} />
          )}
        </Button>
      </Grid>
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

// https://www.geeksforgeeks.org/calculate-the-width-of-the-text-in-javascript/ & https://www.w3docs.com/snippets/javascript/how-to-calculate-text-width-with-javascript.html
const getTextWidth = (text: string) => {
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  const context = canvas.getContext('2d')
  context!.font = 'times new roman 12pt'
  const metrics = context!.measureText(text)
  document.body.removeChild(canvas)
  return Math.ceil(metrics.width)
}
