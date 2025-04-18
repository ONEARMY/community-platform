import { Flex } from 'theme-ui'

import { IMPACT_YEARS } from './constants'
import { ImpactItem } from './ImpactItem'

import type { IUser, IUserImpact } from 'oa-shared'

interface Props {
  impact: IUserImpact | undefined
  user: IUser | undefined
}

export const Impact = (props: Props) => {
  const impact = props.impact || []

  const renderByYear = IMPACT_YEARS.map((year, index) => {
    const foundYear = impact
      ? Object.keys(impact).find((key) => Number(key) === year)
      : undefined

    return (
      <ImpactItem
        fields={foundYear && impact && impact[foundYear]}
        year={year}
        key={index}
        user={props.user}
      />
    )
  })

  return (
    <Flex sx={{ flexFlow: 'row wrap' }} data-cy="ImpactPanel">
      {renderByYear.map((year) => {
        return year
      })}
    </Flex>
  )
}
