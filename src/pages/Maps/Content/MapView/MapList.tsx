import { Button } from 'oa-components'
import { Box, Flex } from 'theme-ui'

import { MapWithListHeader } from './MapWithListHeader'

import type { IMapPin, MapFilterOption, MapFilterOptionsList } from 'oa-shared'

interface IProps {
  pins: IMapPin[]
  allToggleFilters: MapFilterOptionsList

  activePinFilters: MapFilterOptionsList
  setActivePinFilters: (MapFilterOption) => void
  setShowMobileList: (boolean) => void
  showMobileList: boolean
  onBlur: () => void
  onLocationChange: (ILatLng) => void
}

export const MapList = (props: IProps) => {
  const {
    pins,
    allToggleFilters,
    activePinFilters,
    setActivePinFilters,
    setShowMobileList,
    showMobileList,
    onBlur,
    onLocationChange,
  } = props

  const onFilterChange = (changedOption: MapFilterOption) => {
    const isFilterPresent = !!activePinFilters.find(
      (pinFilter) => pinFilter.label == changedOption.label,
    )

    if (isFilterPresent) {
      return setActivePinFilters((filter) =>
        filter.filter(
          (existingOption) => existingOption.label !== changedOption.label,
        ),
      )
    }

    return setActivePinFilters((activePinFilters) => [
      ...activePinFilters,
      changedOption,
    ])
  }

  const mobileListDisplay = showMobileList ? 'block' : 'none'

  return (
    <>
      {/* Desktop list view */}
      <Box
        sx={{
          display: ['none', 'none', 'block', 'block'],
          background: 'white',
          flex: 1,
          overflow: 'scroll',
        }}
      >
        <MapWithListHeader
          pins={pins}
          activePinFilters={activePinFilters}
          availableFilters={allToggleFilters}
          onBlur={onBlur}
          onFilterChange={onFilterChange}
          onLocationChange={onLocationChange}
          viewport="desktop"
        />
      </Box>

      {/* Mobile/tablet list view */}
      <Box
        sx={{
          display: [mobileListDisplay, mobileListDisplay, 'none', 'none'],
          background: 'white',
          width: '100%',
          overflow: 'scroll',
        }}
      >
        <Flex
          sx={{
            justifyContent: 'center',
            paddingBottom: 2,
            position: 'absolute',
            zIndex: 1000,
            width: '100%',
          }}
        >
          <Button
            data-cy="ShowMapButton"
            icon="map"
            sx={{ position: 'sticky', marginTop: 2 }}
            onClick={() => setShowMobileList(false)}
            small
          >
            Show map view
          </Button>
        </Flex>
        <MapWithListHeader
          pins={pins}
          activePinFilters={activePinFilters}
          availableFilters={allToggleFilters}
          onBlur={onBlur}
          onFilterChange={onFilterChange}
          onLocationChange={onLocationChange}
          setShowMobileList={setShowMobileList}
          viewport="mobile"
        />
      </Box>
    </>
  )
}
