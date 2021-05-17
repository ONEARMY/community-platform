import React from 'react'
import { Box } from 'rebass'
import { IComment } from 'src/models'
import { CommentHeader } from './CommentHeader'

export interface IProps extends IComment {}

export const Comment = ({
  creatorName,
  creatorCountry,
  text,
  _created,
}: IProps) => (
  <Box p="3" bg={'white'} mb={4} style={{ borderRadius: '5px' }}>
    <CommentHeader
      creatorCountry={creatorCountry}
      creatorName={creatorName}
      _created={_created}
    ></CommentHeader>
    <p>{text}</p>
  </Box>
)
