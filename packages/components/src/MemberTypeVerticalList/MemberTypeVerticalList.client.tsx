import { Text } from 'theme-ui'

import { CardButton } from '../CardButton/CardButton'
import { MemberBadge } from '../MemberBadge/MemberBadge'
import { VerticalList } from '../VerticalList/VerticalList.client'

import type { MapFilterOption, ProfileTypeName } from 'oa-shared'

export interface IProps {
  activeFilters: MapFilterOption[]
  availableFilters: MapFilterOption[]
  onFilterChange: (filter: MapFilterOption) => void
}

export const MemberTypeVerticalList = (props: IProps) => {
  const { activeFilters, availableFilters, onFilterChange } = props

  const items = availableFilters?.filter(
    ({ filterType }) => filterType === 'profileType',
  )

  if (!items || !items.length || items.length < 2) {
    return null
  }

  return (
    <VerticalList dataCy="MemberTypeVerticalList">
      {items.map((item, index) => {
        const isSelected = !!activeFilters.find(
          (filter) => item.label === filter.label,
        )
        return (
          <CardButton
            data-cy={`MemberTypeVerticalList-Item${
              isSelected ? '-active' : ''
            }`}
            data-testid="MemberTypeVerticalList-Item"
            title={item._id}
            key={index}
            onClick={() => onFilterChange(item)}
            extrastyles={{
              background: 'none',
              flexDirection: 'column',
              minWidth: '130px',
              marginX: 1,
              paddingY: 2,
              textAlign: 'center',
              width: '130px',
              ...(isSelected
                ? {
                    borderColor: 'green',
                    ':hover': { borderColor: 'green' },
                  }
                : {
                    borderColor: 'background',
                    ':hover': { borderColor: 'background' },
                  }),
            }}
            isSelected={isSelected}
          >
            <MemberBadge size={40} profileType={item._id as ProfileTypeName} />
            <Text variant="quiet" sx={{ fontSize: 1 }}>
              {item.label}
            </Text>
          </CardButton>
        )
      })}
    </VerticalList>
  )
}
