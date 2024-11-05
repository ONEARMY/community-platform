import { Flex, Heading, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { ButtonIcon } from '../ButtonIcon/ButtonIcon'
import { MemberBadge } from '../MemberBadge/MemberBadge'
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
        position: 'relative',
        gap: 4,
      }}
    >
      <Flex
        sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}
      >
        <Heading as="h3" variant="small">
          So what are you looking for?
        </Heading>

        <ButtonIcon
          data-cy="MapFilterList-CloseButton"
          icon="close"
          onClick={() => onClose()}
          sx={{ paddingRight: 3, paddingLeft: 2, border: 'none' }}
        />
      </Flex>

      {profileFilters.length > 0 && (
        <Flex sx={{ gap: 1, flexDirection: 'column' }}>
          <Text>Profiles:</Text>
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
          <Text>Activities:</Text>
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

      <Button
        data-cy="MapFilterList-ShowResultsButton"
        icon="sliders"
        onClick={() => onClose()}
        sx={{ alignSelf: 'flex-start' }}
      >
        {buttonLabel}
      </Button>
    </Flex>
  )
}
