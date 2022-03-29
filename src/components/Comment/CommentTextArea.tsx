import styled from '@emotion/styled'
import { Box, Text } from 'theme-ui'
import { Avatar } from '../Avatar'
import { useCommonStores } from 'src/index'
import { Link } from '../Links'

export interface IProps {
  onSubmit: (string) => Promise<void>
  onChange: (string) => void
  comment: string
}

const TextAreaStyled = styled.textarea`
  padding: 1.5em 1em;
  height: 150px;
  border: none;
  min-width: 100%;
  max-width: 100%;
  font-family: 'Inter', Arial, sans-serif;
  font-size: ${props => props.theme.fontSizes[2] + 'px'};
  border-radius: 5px;
  resize: none;

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    background-color: white;
  }
`

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
        <Avatar profileType={user?.profileType} />
      </AvatarBoxStyled>
      <TextBoxStyled>
        {user ? (
          <TextAreaStyled
            disabled={loading}
            value={comment}
            maxLength={400}
            onChange={event => {
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
              sx={{
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
        <TextStyled sx={{ fontSize: 2 }}>{comment.length}/400</TextStyled>
      )}
    </BoxStyled>
  )
}
