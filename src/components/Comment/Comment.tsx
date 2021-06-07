import React from 'react'
import { Box } from 'rebass'
import { IComment } from 'src/models'
import { CommentHeader } from './CommentHeader'

export interface IProps extends IComment {}

export const Comment = (props: IProps) => (
  <Box p="3" bg={'white'} width="100%" mb={4} style={{ borderRadius: '5px' }}>
    <CommentHeader {...props} />
    <p>{props.text}</p>
  </Box>
)
