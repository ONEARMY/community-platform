import { Flex } from 'theme-ui'

import { CardDetailsFallback } from './CardDetailsFallback'
import { CardDetailsMemberProfile } from './CardDetailsMemberProfile'
import { CardDetailsSpaceProfile } from './CardDetailsSpaceProfile'

import type { IMapPin } from 'oa-shared'

export interface IProps {
  item: IMapPin
  isLink?: boolean
}

export const CardProfile = ({ item, isLink = false }: IProps) => {
  const { creator } = item

  const isWorkspace = creator?.profileType && creator?.profileType !== 'member'
  const isMember = !isWorkspace && creator

  return (
    <Flex sx={{ alignItems: 'stretch', alignContent: 'stretch' }}>
      {isWorkspace && (
        <CardDetailsSpaceProfile creator={creator} isLink={isLink} />
      )}
      {isMember && (
        <CardDetailsMemberProfile creator={creator} isLink={isLink} />
      )}
      {(!isWorkspace && !isMember)  && <CardDetailsFallback item={item} isLink={isLink} />}
    </Flex>
  )
}
