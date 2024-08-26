import { Card, Flex } from 'theme-ui'

import { InternalLink } from '../InternalLink/InternalLink'
import { MemberBadge } from '../MemberBadge/MemberBadge'
import { Username } from '../Username/Username'

import type { ProfileTypeName } from 'oa-shared'

export interface ListItem {
  _id: string
  type: ProfileTypeName
}

export interface IProps {
  item: ListItem
}

export const CardListItem = (props: IProps) => {
  const { item } = props

  return (
    <InternalLink
      data-cy="CardListItem"
      data-testid="CardListItem"
      to={`/u/${item._id}`}
      sx={{
        borderRadius: 2,
        marginTop: '2px',
        '&:hover': {
          animationSpeed: '0.3s',
          cursor: 'pointer',
          marginTop: '0',
          borderBottom: '2px solid',
          transform: 'translateY(-2px)',
          transition: 'borderBottom 0.2s, transform 0.2s',
          borderColor: 'black',
        },
        '&:active': {
          transform: 'translateY(1px)',
          borderBottom: '1px solid',
          borderColor: 'grey',
          transition: 'borderBottom 0.2s, transform 0.2s, borderColor 0.2s',
        },
      }}
    >
      <Card>
        <Flex sx={{ flexDirection: 'row', gap: 2, padding: 2 }}>
          <MemberBadge profileType={item.type} size={30} />
          <Username
            user={{ userName: item._id }}
            hideFlag
            sx={{ alignSelf: 'flex-start' }}
          />
        </Flex>
      </Card>
    </InternalLink>
  )
}
