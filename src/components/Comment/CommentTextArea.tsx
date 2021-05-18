import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Text } from 'rebass/styled-components'
import theme from 'src/themes/styled.theme'
import { Avatar } from '../Avatar'
import { useCommonStores } from 'src'

export interface IProps {
  onSubmit: (string) => Promise<void>
}

const TextAreaStyled = styled.textarea`
  padding: 10px;
  height: 150px;
  border: none;
  min-width: 100%;
  max-width: 100%;
  font-family: 'Inter', Arial, sans-serif;
  font-size: ${theme.fontSizes[2] + 'px'};

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
`

const AvatarBoxStyled = styled(Box)`
  position: absolute;
  left: -4em;
`

const TextBoxStyled = styled(Box)`
  &::before {
    content: '';
    position: absolute;
    top: -1em;
    left: -1em;
    border-width: 2em 2em;
    border-style: solid;
    border-color: transparent white transparent transparent;
    margin: 1em -2em;
  }
`

const TextStyled = styled(Text)`
  position: absolute;
  right: 34px;
  bottom: 14px;
`

export const CommentTextArea = ({ onSubmit }) => {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { stores } = useCommonStores()
  const user = stores.userStore.activeUser

  async function keyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && comment.trim().length) {
      e.preventDefault()
      try {
        setLoading(true)
        await onSubmit(comment)
        setLoading(false)
        setComment('')
      } catch (error) {
        // Notify user to resend comment
      }
    }
  }

  return (
    <BoxStyled width={2 / 3} p="3" bg={'white'}>
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
              setComment(event.target.value)
            }}
            placeholder="Leave your questions or feedback..."
            onKeyDown={keyDown}
          />
        ) : (
          <Text height="2em">Hi there! Login to leave a comment</Text>
        )}
      </TextBoxStyled>
      <TextStyled fontSize="2">{comment.length}/400</TextStyled>
    </BoxStyled>
  )
}
