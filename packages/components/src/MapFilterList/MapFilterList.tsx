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

  const tagFilters = availableFilters.filter(
    ({ filterType }) => filterType === 'profileTag',
  )

  const isActive = (checkingFilter: string) =>
    !!activeFilters.find((filter) => filter.label === checkingFilter)

  const buttonLabel = `Show ${pinCount} result${pinCount === 1 ? '' : 's'}`

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
        <Heading as="h3" variant="small">
          So what are you looking for?
        </Heading>

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
          flex: 'auto',
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
            <Text>Activities</Text>
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
