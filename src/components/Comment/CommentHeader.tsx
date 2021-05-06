import React from 'react'
import { Box, Flex, Text } from 'rebass'
import { FlagIconHowTos } from 'src/components/Icons/FlagIcon/FlagIcon'

export interface IProps {
  userCountry?: string
  userName: string
  // TODO: Could be number - depends on BE
  date: string
}

export const CommentHeader = ({ userCountry, userName, date }: IProps) => (
  <Flex justifyContent="space-between" alignItems="baseline">
    <Box>
      {userCountry && <FlagIconHowTos code={userCountry} />}
      <span style={{ marginLeft: userCountry ? '5px' : 0 }}>{userName}</span>
    </Box>
    <Text fontSize={1}>{date}</Text>
  </Flex>
)
