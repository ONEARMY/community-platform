import { Flex } from 'theme-ui'

import { Category } from '../Category/Category'
import { MemberBadge } from '../MemberBadge/MemberBadge'
import { Username } from '../Username/Username'

import type { Category as CategoryType, MapPin } from 'oa-shared'

interface IProps {
  item: MapPin
  isLink: boolean
}

export const CardDetailsFallback = ({ item, isLink }: IProps) => {
  return (
    <Flex sx={{ padding: 2, gap: 2 }}>
      <MemberBadge profileType={item.profile!.type} size={50} />
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Username
          user={{ userName: item.profile!.username }}
          sx={{ alignSelf: 'flex-start' }}
          isLink={isLink}
          target="_blank"
        />
        {item.profile!.type === 'member' && (
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
