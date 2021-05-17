import React from 'react'
import styled from 'styled-components'
import { Box, Text } from 'rebass/styled-components'
import theme from 'src/themes/styled.theme'
import { Avatar } from '../Avatar'

export interface IProps {
  userName?: string
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

export const CommentTextArea = ({ userName }) => (
  <BoxStyled width={2 / 3} p="3" bg={'white'}>
    <AvatarBoxStyled>
      <Avatar userName={userName} />
    </AvatarBoxStyled>
    <TextBoxStyled>
      {userName ? (
        <TextAreaStyled placeholder="Leave your questions or feedback..." />
      ) : (
        <Text height="2em">Hi there! Login to leave a comment</Text>
      )}
    </TextBoxStyled>
  </BoxStyled>
)
