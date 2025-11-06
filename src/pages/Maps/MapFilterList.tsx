import { useContext, useMemo } from 'react'
import {
  Button,
  ButtonIcon,
  MapFilterListItem,
  MemberBadge,
  UserBadge,
} from 'oa-components'
import { Checkbox, Flex, Heading, Label, Text } from 'theme-ui'

import { MapContext } from './MapContext'

type MapFilterListProps = {
  onClose: () => void
}

export const MapFilterList = ({ onClose }: MapFilterListProps) => {
  const mapState = useContext(MapContext)

  if (!mapState) {
    return null
  }

  const visibleTags = useMemo(
    () =>
      mapState.allTags.filter(
        (tag) =>
          mapState.activeTagFilters.includes(tag.id) ||
          mapState.filteredPins.some((pin) =>
            pin.profile?.tags?.some((t) => t.id === tag.id),
          ),
      ),
    [mapState.allTags, mapState.activeTagFilters, mapState.filteredPins],
  )

  const visibleBadges = useMemo(
    () =>
      mapState.allBadges.filter(
        (badge) =>
          mapState.activeBadgeFilters.includes(badge.name) ||
          mapState.filteredPins.some((pin) =>
            pin.profile?.badges?.some((b) => b.name === badge.name),
          ),
      ),
    [mapState.allBadges, mapState.activeBadgeFilters, mapState.filteredPins],
  )

  const pinCount = mapState?.filteredPins?.length || 0
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
          overflow: 'auto',
          padding: 2,
        }}
      >
        {(mapState.allProfileTypes?.length || 0) > 0 && (
          <MapFilterListWrapper title="Profiles">
            {mapState.allProfileTypes.map((profileType, index) => (
              <MapFilterListItem
                active={mapState.activeProfileTypeFilters.includes(
                  profileType.name,
                )}
                key={index}
                onClick={() =>
                  mapState.toggleActiveProfileTypeFilter(profileType.name)
                }
                filterType="profile"
              >
                <MemberBadge size={30} profileType={profileType} />
                <Text variant="quiet" sx={{ fontSize: 1 }}>
                  {profileType.displayName}
                </Text>
              </MapFilterListItem>
            ))}
          </MapFilterListWrapper>
        )}
        {mapState.allTags.length > 0 && (
          <MapFilterListWrapper title="Spaces activities">
            {visibleTags.length > 0 ? (
              visibleTags.map((tag) => (
                <MapFilterListItem
                  active={mapState.activeTagFilters.includes(tag.id)}
                  key={tag.id}
                  onClick={() => mapState.toggleActiveTagFilter(tag.id)}
                  sx={{ maxWidth: 'auto', width: 'auto' }}
                  filterType="tag"
                >
                  <Text variant="quiet" sx={{ fontSize: 1 }}>
                    {tag.name}
                  </Text>
                </MapFilterListItem>
              ))
            ) : (
              <Text variant="quiet" sx={{ fontSize: 1 }}>
                No space activities to show
              </Text>
            )}
          </MapFilterListWrapper>
        )}

        {(mapState.allBadges?.length || 0) > 0 && (
          <MapFilterListWrapper title="Badges">
            {visibleBadges.length > 0 ? (
              visibleBadges.map((badge) => (
                <Label key={badge.id} sx={{ alignItems: 'center', gap: 0 }}>
                  <Checkbox
                    onClick={() => mapState.toggleActiveBadgeFilter(badge.name)}
                    defaultChecked={mapState.activeBadgeFilters?.includes(
                      badge.name,
                    )}
                  />
                  {badge.displayName}
                  <UserBadge badge={badge} />
                </Label>
              ))
            ) : (
              <Text variant="quiet" sx={{ fontSize: 1 }}>
                No badges to show
              </Text>
            )}
          </MapFilterListWrapper>
        )}

        {(mapState?.allProfileSettings?.length || 0) > 0 && (
          <MapFilterListWrapper title="Profile Specifications">
            {mapState?.allProfileSettings.map((setting) => {
              return (
                <Label key={setting} sx={{ alignItems: 'center', gap: 0 }}>
                  <Checkbox
                    onClick={() =>
                      mapState.toggleActiveProfileSettingFilter(setting)
                    }
                    defaultChecked={mapState.activeBadgeFilters?.includes(
                      setting,
                    )}
                  />
                  {/* There is only 1 for now, so it's hardcoded. */}
                  Open to Visitors
                </Label>
              )
            })}
          </MapFilterListWrapper>
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

const MapFilterListWrapper = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <Flex sx={{ gap: 1, flexDirection: 'column' }}>
      <Text>{title}</Text>
      <Flex
        as="ul"
        data-cy="MapFilterList"
        sx={{
          listStyle: 'none',
          flexWrap: 'wrap',
          gap: 2,
          flexDirection: 'row',
          padding: 0,
        }}
      >
        {children}
      </Flex>
    </Flex>
  )
}
