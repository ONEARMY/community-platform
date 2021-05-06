import React from 'react'
import { FlagIconHowTos } from 'src/components/Icons/FlagIcon/FlagIcon'

export interface IProps {
  userCountry?: string
  userName: string
  // TODO: Could be number - depends on BE
  date: string
}

export const CommentHeader = ({ userCountry, userName, date }: IProps) => (
  <div>
    {userCountry && <FlagIconHowTos code={userCountry} />}
    <span>{userName}</span>
    <span>{date}</span>
  </div>
)
