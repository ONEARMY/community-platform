import { observer } from 'mobx-react'
import { Button, ExternalLink } from 'oa-components'
import { Flex, Text } from 'theme-ui'

import { useCommonStores } from 'src/'
import { invisible, missing } from './labels'
import { IMPACT_REPORT_LINKS } from './constants'

import type { IImpactYear, IImpactYearFieldList, IUserPP } from 'src/models'

interface Props {
  fields: IImpactYearFieldList | undefined
  user: IUserPP | undefined
  visibleFields: IImpactYearFieldList | undefined
  year: IImpactYear
}

const isAllInvisible = (fields, visibleFields) => {
  if (
    visibleFields &&
    visibleFields.length === 0 &&
    fields &&
    fields.length > 0
  ) {
    return true
  }

  return false
}

export const ImpactMissing = observer((props: Props) => {
  const { fields, user, visibleFields, year } = props
  const { userStore } = useCommonStores().stores

  const labelSet = isAllInvisible(fields, visibleFields) ? invisible : missing

  const isPageOwner = userStore.activeUser && user

  const userButton = `${year} ${labelSet.user.link}`
  const label = isPageOwner ? labelSet.owner.label : labelSet.user.label

  return (
    <Flex sx={{ flexFlow: 'column', gap: 2, mt: 2 }}>
      <Text>{label}</Text>
      {!isPageOwner && (
        <ExternalLink href={IMPACT_REPORT_LINKS[year]}>
          <Button>{userButton}</Button>
        </ExternalLink>
      )}
      {isPageOwner && (
        <a href="/settings">
          <Button>{labelSet.owner.link}</Button>
        </a>
      )}
    </Flex>
  )
})
