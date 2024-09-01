import { Flex } from 'theme-ui'

import { Category } from '../Category/Category'
import { MemberBadge } from '../MemberBadge/MemberBadge'
import { Username } from '../Username/Username'

import type { ListItem } from './types'

interface IProps {
  item: ListItem
}

export const CardDetailsFallback = ({ item }: IProps) => {
  const { _id, isSupporter, isVerified, subType, type } = item

  return (
    <Flex sx={{ padding: 2, gap: 2 }}>
      <MemberBadge profileType={type} size={50} />
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Username
          user={{
            userName: _id,
            isVerified: isVerified || false,
            isSupporter: isSupporter || false,
          }}
          sx={{ alignSelf: 'flex-start' }}
          isLink={false}
        />
        {subType && (
          <Category
            category={{ label: 'Wants to get started' }}
            sx={{
              border: '1px solid #0087B6',
              backgroundColor: '#ECFAFF',
              color: '#0087B6',
            }}
          />
        )}
        {type === 'member' && (
          <Category
            category={{ label: 'Wants to get started' }}
            sx={{
              border: '1px solid #A72E5A',
              backgroundColor: '#F7C7D9',
              color: '#A72E5A',
            }}
          />
        )}
      </Flex>
    </Flex>
  )
}
