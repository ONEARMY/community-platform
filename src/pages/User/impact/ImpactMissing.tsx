import { observer } from 'mobx-react'
import { Button, ExternalLink } from 'oa-components'
import { Flex, Text } from 'theme-ui'

import { useCommonStores } from 'src/'
import { missing } from './labels'
import { IMPACT_REPORT_LINKS } from './constants'

import type { IImpactYear, IUserPP } from 'src/models'

interface Props {
  year: IImpactYear
  user: IUserPP
}

export const ImpactMissing = observer(({ user, year }: Props) => {
  const { userStore } = useCommonStores().stores

  const isPageOwner = userStore.activeUser && user

  const button = `${year} ${missing.user.link}`
  const href = IMPACT_REPORT_LINKS[year]
  const label = isPageOwner ? missing.owner.label : missing.user.label

  return (
    <Flex sx={{ flexFlow: 'column', gap: 2, mt: 2 }}>
      <Text>{label}</Text>
      {!isPageOwner && (
        <ExternalLink href={href}>
          <Button>{button}</Button>
        </ExternalLink>
      )}
    </Flex>
  )
})
