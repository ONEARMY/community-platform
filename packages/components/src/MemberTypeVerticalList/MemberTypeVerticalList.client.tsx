import { Text } from 'theme-ui'

import { CardButton } from '../CardButton/CardButton'
import { MemberBadge } from '../MemberBadge/MemberBadge'
import { VerticalList } from '../VerticalList/VerticalList.client'

import type {
  MapFilterOption,
  MapFilterOptionsList,
  ProfileTypeName,
} from 'oa-shared'

export interface IProps {
  activeFilters: MapFilterOptionsList
  availableFilters: MapFilterOptionsList
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
        const active = activeFilters.find(
          (filter) => item.label === filter.label,
        )
        return (
          <CardButton
            data-cy={`MemberTypeVerticalList-Item${active ? '-active' : ''}`}
            data-testid="MemberTypeVerticalList-Item"
            title={item._id}
            key={index}
            onClick={() => onFilterChange(item)}
            extrastyles={{
              background: 'none',
              textAlign: 'center',
              width: '130px',
              minWidth: '130px',
              marginX: 1,
              height: '75px',
              flexDirection: 'column',
              ...(active
                ? {
                    borderColor: 'green',
                    ':hover': { borderColor: 'green' },
                  }
                : {
                    borderColor: 'background',
                    ':hover': { borderColor: 'background' },
                  }),
            }}
          >
            <MemberBadge size={40} profileType={item._id as ProfileTypeName} />
            <br />
            <Text variant="quiet" sx={{ fontSize: 1 }}>
              {item.label}
            </Text>
          </CardButton>
        )
      })}
    </VerticalList>
  )
}
