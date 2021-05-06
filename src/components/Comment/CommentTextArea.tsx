import React from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'

export interface IProps {}

const TextAreaStyled = styled.textarea`
  padding: 10px;
  height: 150px;
  border: none;
  width: 100%;

  &:focus-visible {
    outline: none;
  }
`

export const CommentTextArea = () => (
  <Box width={2 / 3} p="3" bg={'white'} style={{ borderRadius: '5px' }}>
    <TextAreaStyled placeholder="Leave your questions or feedback..." />
  </Box>
)
