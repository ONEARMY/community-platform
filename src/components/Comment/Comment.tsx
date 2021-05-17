import React from 'react'
import { Box } from 'rebass'
import { CommentHeader } from './CommentHeader'

export interface IProps {
  userCountry: string
  userName: string
  comment: string
  date: string
}

export const Comment = ({ userCountry, userName, date, comment }: IProps) => (
  <Box p="3" bg={'white'} mb={4} style={{ borderRadius: '5px' }}>
    <CommentHeader
      userCountry={userCountry}
      userName={userName}
      date={date}
    ></CommentHeader>
    <p>{comment}</p>
  </Box>
)
