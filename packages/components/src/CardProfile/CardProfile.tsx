import { Flex } from 'theme-ui'

import { CardDetailsFallback } from './CardDetailsFallback'
import { CardDetailsMemberProfile } from './CardDetailsMemberProfile'
import { CardDetailsSpaceProfile } from './CardDetailsSpaceProfile'

import type { MapListItem } from '../types/common'

export interface IProps {
  item: MapListItem
  isLink?: boolean
}

export const CardProfile = ({ item, isLink = false }: IProps) => {
  const { creator } = item

  const isMember = creator?.profileType === 'member'

  return (
    <Flex sx={{ alignItems: 'stretch', alignContent: 'stretch' }}>
      {isMember && (
        <CardDetailsMemberProfile creator={creator} isLink={isLink} />
      )}
      {!isMember && creator && (
        <CardDetailsSpaceProfile creator={creator} isLink={isLink} />
      )}
      {!creator && <CardDetailsFallback item={item} />}
    </Flex>
  )
}
