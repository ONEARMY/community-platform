import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { Box, Flex, Text } from 'rebass'
import { useCommonStores } from 'src'
import { FlagIconHowTos } from 'src/components/Icons/FlagIcon/FlagIcon'
import { IComment } from 'src/models'
import { hasAdminRights } from 'src/utils/helpers'
import { Link } from 'src/components/Links'


export interface IProps extends Omit<IComment, 'text'> { }

export const CommentHeader = ({
  creatorName,
  creatorCountry,
  _created,
  _creatorId,
  _id,
}: IProps) => {
  const { stores } = useCommonStores()
  const user = stores.userStore.activeUser

  return (
    <Flex justifyContent="space-between" alignItems="baseline">
      <Box>
        {creatorCountry && <FlagIconHowTos code={creatorCountry} />}
        <span style={{ marginLeft: creatorCountry ? '5px' : 0 }}>
          <Link
            sx={{
              textDecoration: 'underline',
              color: 'inherit',
            }}
            to={'/u/' + creatorName}
          >
            {creatorName}
          </Link>
        </span>
      </Box>
      <Flex>
        <Text fontSize={1}>
          {new Date(_created).toLocaleDateString('en-GB').replaceAll('/', '-')}
        </Text>
        {user && (user._id === _creatorId || hasAdminRights(user)) && (
          <FaTrash
            color="red"
            fontSize="12px"
            style={{
              marginLeft: '8px',
              cursor: 'pointer',
              alignItems: 'center',
            }}
            onClick={async () => await stores.howtoStore.deleteComment(_id)}
          ></FaTrash>
        )}
      </Flex>
    </Flex>
  )
}
