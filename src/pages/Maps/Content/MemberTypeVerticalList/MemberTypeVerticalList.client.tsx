import { useContext } from 'react'
import { CardButton, MemberBadge, VerticalList } from 'oa-components'
import { Text } from 'theme-ui'

import { MapContext } from '../../MapContext'

import type { ProfileTypeName } from 'oa-shared'

export const MemberTypeList = () => {
  const mapState = useContext(MapContext)

  if (!mapState || (mapState.allProfileTypes?.length || 0) < 2) {
    return null
  }

  return (
    <VerticalList dataCy="MemberTypeVerticalList">
      {mapState.allProfileTypes.map((profileType, index) => {
        const isSelected = !!mapState.activeProfileTypeFilters.find(
          (activeFilter) => profileType.name === activeFilter,
        )

        return (
          <CardButton
            data-cy={`MemberTypeVerticalList-Item${
              isSelected ? '-active' : ''
            }`}
            data-testid="MemberTypeVerticalList-Item"
            title={profileType.displayName}
            key={index}
            onClick={() =>
              mapState.toggleActiveProfileTypeFilter(profileType.name)
            }
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
            <MemberBadge
              size={40}
              profileType={profileType.name as ProfileTypeName}
            />
            <Text variant="quiet" sx={{ fontSize: 1 }}>
              {profileType.displayName}
            </Text>
          </CardButton>
        )
      })}
    </VerticalList>
  )
}
