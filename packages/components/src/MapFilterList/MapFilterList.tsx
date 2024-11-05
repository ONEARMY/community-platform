import { Flex, Heading, Image, Text } from 'theme-ui'

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
}

export const MapFilterList = (props: IProps) => {
  const { activeFilters, availableFilters, onClose, onFilterChange } = props

  const profileFilters = availableFilters.filter(
    ({ filterType }) => filterType === 'profileType',
  )
  const workspaceFilters = availableFilters.filter(
    ({ filterType }) => filterType === 'workspaceType',
  )

  const isActive = (checkingFilter: string) =>
    !!activeFilters.find((filter) => filter.label === checkingFilter)

  return (
    <Flex
      data-cy="MapFilterList"
      sx={{
        flexDirection: 'column',
        position: 'relative',
        gap: 2,
      }}
    >
      <Flex sx={{ gap: 2 }}>
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

      {workspaceFilters.length > 0 && (
        <>
          <Text>Workspace:</Text>
          <MapFilterListWrapper>
            {workspaceFilters.map((typeFilter, index) => {
              const onClick = () => onFilterChange(typeFilter)

              return (
                <MapFilterListItem
                  active={isActive(typeFilter.label)}
                  key={index}
                  onClick={onClick}
                >
                  {typeFilter.imageSrc && (
                    <Image
                      src={typeFilter.imageSrc}
                      sx={{ height: 30, width: 30 }}
                    />
                  )}
                  <Text variant="quiet" sx={{ fontSize: 1 }}>
                    {typeFilter.label}
                  </Text>
                </MapFilterListItem>
              )
            })}
          </MapFilterListWrapper>
        </>
      )}

      {profileFilters.length > 0 && (
        <>
          <Text>Profiles:</Text>
          <MapFilterListWrapper>
            {profileFilters.map((typeFilter, index) => {
              const onClick = () => onFilterChange(typeFilter)

              return (
                <MapFilterListItem
                  active={isActive(typeFilter.label)}
                  key={index}
                  onClick={onClick}
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
        </>
      )}
    </Flex>
  )
}
