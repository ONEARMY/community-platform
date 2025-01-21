import { Flex } from 'theme-ui'

import { Category } from '../Category/Category'
import { MemberBadge } from '../MemberBadge/MemberBadge'
import { Username } from '../Username/Username'

import type { Category as CategoryType, IMapPin } from 'oa-shared'

interface IProps {
  item: IMapPin
  isLink: boolean
}

export const CardDetailsFallback = ({ item, isLink }: IProps) => {
  const { _id, subType, type } = item

  return (
    <Flex sx={{ padding: 2, gap: 2 }}>
      <MemberBadge profileType={type} size={50} />
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Username
          user={{ userName: _id }}
          sx={{ alignSelf: 'flex-start' }}
          isLink={isLink}
          target="_blank"
        />
        {subType && (
          <Category
            category={{ name: subType } as CategoryType}
            sx={{
              border: '1px solid #0087B6',
              backgroundColor: '#ECFAFF',
              color: '#0087B6',
            }}
          />
        )}
        {type === 'member' && (
          <Category
            category={{ name: 'Wants to get started' } as CategoryType}
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
