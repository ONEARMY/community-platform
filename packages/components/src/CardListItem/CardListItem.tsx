import { Flex } from 'theme-ui'

import { CardButton } from '../CardButton/CardButton'
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
      <CardButton>
        <Flex sx={{ gap: 2, alignItems: 'stretch', alignContent: 'stretch' }}>
          {isMember && <CardDetailsMemberProfile creator={creator} />}

          {!isMember && creator && (
            <CardDetailsSpaceProfile creator={creator} />
          )}

          {!creator && <CardDetailsFallback item={item} />}
        </Flex>
      </CardButton>
    </InternalLink>
  )
}
