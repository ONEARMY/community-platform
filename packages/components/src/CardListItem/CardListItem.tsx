import { Card, Flex } from 'theme-ui'

import { MemberBadge } from '../MemberBadge/MemberBadge'
import { Username } from '../Username/Username'

import type { IProfileTypeName } from 'oa-shared'

export interface ListItem {
  _id: string
  type: IProfileTypeName
}

export interface IProps {
  item: ListItem
  onClick: (id: string) => void
}

export const CardListItem = (props: IProps) => {
  const { item, onClick } = props
  const { type } = item

  return (
    <Card
      data-testid="CardListItem"
      onClick={() => onClick(item._id)}
      sx={{ width: '31%', borderRadius: 2, cursor: 'hand' }}
    >
      <Flex sx={{ flexDirection: 'row', gap: 2, padding: 2 }}>
        <MemberBadge profileType={type} size={30} />
        <Username
          user={{ userName: item._id }}
          hideFlag
          sx={{ alignSelf: 'flex-start' }}
        />
      </Flex>
    </Card>
  )
}
