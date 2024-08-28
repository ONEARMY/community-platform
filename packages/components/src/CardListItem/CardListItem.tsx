import { Card, Flex } from 'theme-ui'

import { InternalLink } from '../InternalLink/InternalLink'
import { CardDetailsFallback } from './CardDetailsFallback'
import { CardDetailsMemberProfile } from './CardDetailsMemberProfile'
import { CardDetailsSpaceProfile } from './CardDetailsSpaceProfile'

import type { ListItem } from './types'

export interface IProps {
  item: ListItem
}

export const CardListItem = ({ item }: IProps) => {
  const { creator } = item

  const isMember = creator?.profileType === 'member'

  return (
    <InternalLink
      data-cy="CardListItem"
      data-testid="CardListItem"
      to={`/u/${item._id}`}
      sx={{
        borderRadius: 2,
        padding: 2,
      }}
    >
      <Card
        sx={{
          marginTop: '2px',
          borderRadius: 2,
          padding: 0,
          '&:hover': {
            animationSpeed: '0.3s',
            cursor: 'pointer',
            marginTop: '0',
            borderBottom: '4px solid',
            transform: 'translateY(-2px)',
            transition: 'borderBottom 0.2s, transform 0.2s',
            borderColor: 'black',
          },
          '&:active': {
            transform: 'translateY(1px)',
            borderBottom: '3px solid',
            borderColor: 'grey',
            transition: 'borderBottom 0.2s, transform 0.2s, borderColor 0.2s',
          },
          alignItems: 'stretch',
          alignContent: 'stretch',
        }}
      >
        <Flex sx={{ gap: 2, alignItems: 'stretch', alignContent: 'stretch' }}>
          {isMember && <CardDetailsMemberProfile creator={creator} />}

          {!isMember && creator && (
            <CardDetailsSpaceProfile creator={creator} />
          )}

          {!creator && <CardDetailsFallback item={item} />}
        </Flex>
      </Card>
    </InternalLink>
  )
}
