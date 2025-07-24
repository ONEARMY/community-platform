import { Flex } from 'theme-ui'

import { CardDetailsFallback } from './CardDetailsFallback'
import { CardDetailsMemberProfile } from './CardDetailsMemberProfile'
import { CardDetailsSpaceProfile } from './CardDetailsSpaceProfile'

import type { MapPin } from 'oa-shared'

export interface IProps {
  item: MapPin
  isLink?: boolean
}

export const CardProfile = ({ item, isLink = false }: IProps) => {
  const { profile } = item

  const isWorkspace = profile?.type === 'space'
  const isMember = !isWorkspace && profile

  return (
    <Flex sx={{ alignItems: 'stretch', alignContent: 'stretch' }}>
      {isWorkspace && (
        <CardDetailsSpaceProfile profile={profile} isLink={isLink} />
      )}
      {isMember && (
        <CardDetailsMemberProfile profile={profile} isLink={isLink} />
      )}
      {!isWorkspace && !isMember && (
        <CardDetailsFallback item={item} isLink={isLink} />
      )}
    </Flex>
  )
}
