import styled from '@emotion/styled'
import { Box, Text, Textarea } from 'theme-ui'
import { Link } from 'react-router-dom'
import { useCommonStores } from 'src/index'
import { MAX_COMMENT_LENGTH } from './constants'
import { MemberBadge } from 'oa-components'

export interface IProps {
  onSubmit: (string) => Promise<void>
  onChange: (string) => void
  comment: string
}

const BoxStyled = styled(Box)`
  position: relative;
  border-radius: 5px;
  display: block;
`

const AvatarBoxStyled = styled(Box)`
  position: absolute;
  left: -4em;
  top: 1em;
`

const TextBoxStyled = styled(Box)`
  display: block;
  &::before {
    content: '';
    position: absolute;
    border-width: 1em 1em;
    border-style: solid;
    border-color: transparent white transparent transparent;
    margin: 1em -2em;
  }
`

const TextStyled = styled(Text)`
  position: absolute;
  right: 8px;
  bottom: 6px;
`

const LoginTextStyled = styled(Text)`
  display: block;
  padding: 1.5em 1em;
`

export const CommentTextArea = ({ onChange, comment, loading }) => {
  const { stores } = useCommonStores()
  const user = stores.userStore.activeUser

  return (
    <BoxStyled sx={{ background: 'white' }}>
      <AvatarBoxStyled>
        <MemberBadge
          profileType={user?.profileType || 'member'}
          useLowDetailVersion
        />
      </AvatarBoxStyled>
      <TextBoxStyled>
        {user ? (
          <Textarea
            disabled={loading}
            value={comment}
            maxLength={MAX_COMMENT_LENGTH}
            onChange={(event) => {
              onChange(event.target.value)
            }}
            data-cy="comments-form"
            placeholder="Leave your questions or feedback..."
          />
        ) : (
          <LoginTextStyled data-cy="comments-login-prompt">
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
          </LoginTextStyled>
        )}
      </TextBoxStyled>
      {user && (
        <TextStyled sx={{ fontSize: 2 }}>
          {comment.length}/{MAX_COMMENT_LENGTH}
        </TextStyled>
      )}
    </BoxStyled>
  )
}
