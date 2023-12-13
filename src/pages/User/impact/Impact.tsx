import { Flex } from 'theme-ui'

import { ImpactItem } from './ImpactItem'
import { IMPACT_YEARS } from './constants'

import type { IUserImpact, IUserPP } from 'src/models'

interface Props {
  impact: IUserImpact
  user: IUserPP | undefined
}

export const Impact = ({ impact, user }: Props) => {
  const renderByYear = IMPACT_YEARS.map((year, index) => {
    const foundYear = Object.keys(impact).find((key) => Number(key) === year)

    return (
      <ImpactItem
        fields={foundYear && impact[foundYear]}
        year={year}
        key={index}
        user={user}
      />
    )
  })

  const sx = {
    flexFlow: 'row wrap',
    my: 2,
  }

  return (
    <Flex sx={sx} data-cy="ImpactPanel">
      {renderByYear.map((year) => {
        return year
      })}
    </Flex>
  )
}
