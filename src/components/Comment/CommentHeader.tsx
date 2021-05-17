import React from 'react'
import { Box, Flex, Text } from 'rebass'
import { FlagIconHowTos } from 'src/components/Icons/FlagIcon/FlagIcon'
import { IComment } from 'src/models'

export interface IProps extends Omit<IComment, '_id' | 'text' | '_creatorId'> {}

export const CommentHeader = ({
  creatorName,
  creatorCountry,
  _created,
}: IProps) => (
  <Flex justifyContent="space-between" alignItems="baseline">
    <Box>
      {creatorCountry && <FlagIconHowTos code={creatorCountry} />}
      <span style={{ marginLeft: creatorCountry ? '5px' : 0 }}>
        {creatorName}
      </span>
    </Box>
    <Text fontSize={1}>{_created}</Text>
  </Flex>
)
