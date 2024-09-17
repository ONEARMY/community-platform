import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Button, ExternalLink } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Flex, Text } from 'theme-ui'

import { IMPACT_REPORT_LINKS } from './constants'
import { invisible, missing, reportYearLabel } from './labels'

import type { IImpactYear, IImpactYearFieldList, IUser } from 'src/models'

interface Props {
  fields: IImpactYearFieldList | undefined
  owner: IUser | undefined
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

const isPageOwnerCheck = (activeUser, owner) => {
  const usersPresent = activeUser && owner
  const usersTheSame = toJS(activeUser)?.userName === owner?.userName

  return usersPresent && usersTheSame ? true : false
}

export const ImpactMissing = observer((props: Props) => {
  const { fields, owner, visibleFields, year } = props
  const { userStore } = useCommonStores().stores

  const labelSet = isAllInvisible(fields, visibleFields) ? invisible : missing

  const isPageOwner = isPageOwnerCheck(userStore.activeUser, owner)
  const isReportYear = IMPACT_REPORT_LINKS[year] ? true : false

  const button = `${year} ${labelSet.user.link}`
  const label = isPageOwner ? labelSet.owner.label : labelSet.user.label

  return (
    <Flex sx={{ flexFlow: 'column', gap: 2, mt: 2 }}>
      <Text>{label}</Text>
      {!isPageOwner && isReportYear && (
        <>
          <Text>{reportYearLabel}</Text>
          <ExternalLink href={IMPACT_REPORT_LINKS[year]}>
            <Button type="button">{button}</Button>
          </ExternalLink>
        </>
      )}
      {isPageOwner && (
        <a href={`/settings/impact/#year_${year}`}>
          <Button type="button">{labelSet.owner.link}</Button>
        </a>
      )}
    </Flex>
  )
})
