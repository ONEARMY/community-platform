import React from 'react'
import { CommentHeader } from './CommentHeader'

export interface IProps {}

export const Comment = ({}: IProps) => {
  return (
    <div>
      <CommentHeader
        userCountry="de-DE"
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
    </div>
  )
}
