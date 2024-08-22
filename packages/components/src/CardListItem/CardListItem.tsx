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
      data-cy="CardListItem"
      data-testid="CardListItem"
      onClick={() => onClick(item._id)}
      sx={{
        borderRadius: 2,
        width: '31%',
        marginTop: '2px',
        '&:hover': {
          animationSpeed: '0.3s',
          cursor: 'pointer',
          marginTop: '0',
          borderBottom: '4px solid',
          transform: 'translateY(-2px)',
          transition: 'borderBottom 0.2s, transform 0.2s',
        },
        '&:active': {
          transform: 'translateY(1px)',
          borderBottom: '3px solid',
          borderColor: 'grey',
          transition: 'borderBottom 0.2s, transform 0.2s, borderColor 0.2s',
        },
      }}
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
