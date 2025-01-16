import { Checkbox, Flex, Heading, Label, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { ButtonIcon } from '../ButtonIcon/ButtonIcon'
import { MemberBadge } from '../MemberBadge/MemberBadge'
import { UserBadge } from '../Username/UserBadge'
import { MapFilterListItem } from './MapFilterListItem'
import { MapFilterListWrapper } from './MapFilterListWrapper'

import type {
  MapFilterOption,
  MapFilterOptionsList,
  ProfileTypeName,
} from 'oa-shared'

export interface IProps {
  activeFilters: MapFilterOptionsList
  availableFilters: MapFilterOptionsList
  onClose: () => void
  onFilterChange: (filter: MapFilterOption) => void
  pinCount: number
}

export const MapFilterList = (props: IProps) => {
  const { activeFilters, availableFilters, onClose, onFilterChange, pinCount } =
    props

  const badgeFilters = availableFilters.filter(
    ({ filterType }) => filterType === 'badge',
  )
  const profileFilters = availableFilters.filter(
    ({ filterType }) => filterType === 'profileType',
  )

  const tagFilters = availableFilters
    .slice(0)
    .filter(({ filterType }) => filterType === 'profileTag')
    .sort((a, b) => (a.label > b.label ? 1 : 0))

  const isActive = (checkingFilter: string) =>
    !!activeFilters.find((filter) => filter.label === checkingFilter)

  const buttonLabel = `${pinCount} result${
    pinCount === 1 ? '' : 's'
  } in current view`

  return (
    <Flex
      data-cy="MapFilterList"
      sx={{
        flexDirection: 'column',
        maxHeight: '100%',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          borderBottom: '1px solid',
          gap: 2,
          justifyContent: 'space-between',
          padding: 2,
        }}
      >
        <Flex sx={{ flexDirection: 'column' }}>
          <Heading as="h3" variant="small">
            Filter what you see
          </Heading>

          <Text variant="quiet">
            Zoom out on the map to search the whole world
          </Text>
        </Flex>

        <ButtonIcon
          data-cy="MapFilterList-CloseButton"
          icon="close"
          onClick={() => onClose()}
          sx={{ border: 'none', paddingLeft: 2, paddingRight: 3 }}
        />
      </Flex>

      <Flex
        sx={{
          flexDirection: 'column',
          flex: 1,
          gap: 2,
          overflow: 'scroll',
          padding: 2,
        }}
      >
        {profileFilters.length > 0 && (
          <Flex sx={{ gap: 1, flexDirection: 'column' }}>
            <Text>Profiles</Text>
            <MapFilterListWrapper>
              {profileFilters.map((typeFilter, index) => {
                const onClick = () => onFilterChange(typeFilter)

                return (
                  <MapFilterListItem
                    active={isActive(typeFilter.label)}
                    key={index}
                    onClick={onClick}
                    filterType="profile"
                  >
                    <MemberBadge
                      size={30}
                      profileType={typeFilter._id as ProfileTypeName}
                    />
                    <Text variant="quiet" sx={{ fontSize: 1 }}>
                      {typeFilter.label}
                    </Text>
                  </MapFilterListItem>
                )
              })}
            </MapFilterListWrapper>
          </Flex>
        )}

        {tagFilters.length > 0 && (
          <Flex sx={{ gap: 1, flexDirection: 'column' }}>
            <Text>Spaces activities</Text>
            <MapFilterListWrapper>
              {tagFilters.map((typeFilter, index) => {
                const onClick = () => onFilterChange(typeFilter)

                return (
                  <MapFilterListItem
                    active={isActive(typeFilter.label)}
                    key={index}
                    onClick={onClick}
                    sx={{ maxWidth: 'auto', width: 'auto' }}
                    filterType="tag"
                  >
                    <Text variant="quiet" sx={{ fontSize: 1 }}>
                      {typeFilter.label}
                    </Text>
                  </MapFilterListItem>
                )
              })}
            </MapFilterListWrapper>
          </Flex>
        )}

        {badgeFilters.length > 0 && (
          <Flex sx={{ gap: 1, flexDirection: 'column' }}>
            <Text>Badges</Text>
            <MapFilterListWrapper>
              {badgeFilters.map((typeFilter, index) => {
                const onClick = () => onFilterChange(typeFilter)

                return (
                  <Label key={index} sx={{ alignItems: 'center', gap: 0 }}>
                    <Checkbox
                      onClick={onClick}
                      defaultChecked={isActive(typeFilter.label)}
                    />
                    {typeFilter.label}
                    <UserBadge badgeName={typeFilter._id} />
                  </Label>
                )
              })}
            </MapFilterListWrapper>
          </Flex>
        )}
      </Flex>

      <Flex sx={{ borderTop: '1px solid', padding: 2 }}>
        <Button
          data-cy="MapFilterList-ShowResultsButton"
          icon="sliders"
          onClick={() => onClose()}
          sx={{ alignSelf: 'flex-start' }}
        >
          {buttonLabel}
        </Button>
      </Flex>
    </Flex>
  )
}
