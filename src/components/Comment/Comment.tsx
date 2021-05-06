import React from 'react'
import { Box } from 'rebass'
import { CommentHeader } from './CommentHeader'

export interface IProps {}

//TODO: Styled box
export const Comment = ({}: IProps) => {
  return (
    <Box p="3" bg={'white'} mb={4} style={{ borderRadius: '5px' }}>
      <CommentHeader
        userCountry="de"
        userName="Max Mustermann"
        date="00-00-0000"
      ></CommentHeader>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    </Box>
  )
}
