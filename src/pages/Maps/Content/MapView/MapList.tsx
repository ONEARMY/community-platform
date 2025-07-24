import { Button } from 'oa-components'
import { Box, Flex } from 'theme-ui'

import { MapWithListHeader } from './MapWithListHeader'

import type { MapFilterOption, MapPin } from 'oa-shared'

interface IProps {
  activePinFilters: MapFilterOption[]
  allToggleFilters: MapFilterOption[]
  notification: string
  onBlur: () => void
  onLocationChange: (ILatLng) => void
  onPinClick: (pin: MapPin) => void
  pins: MapPin[] | null
  selectedPin: MapPin | undefined
  setActivePinFilters: (MapFilterOption) => void
  setShowMobileList: (boolean) => void
  showMobileList: boolean
}

export const MapList = (props: IProps) => {
  const {
    activePinFilters,
    allToggleFilters,
    notification,
    onBlur,
    onLocationChange,
    onPinClick,
    pins,
    selectedPin,
    setActivePinFilters,
    setShowMobileList,
    showMobileList,
  } = props

  const onFilterChange = (changedOption: MapFilterOption) => {
    const isFilterPresent = !!activePinFilters.find(
      (pinFilter) => pinFilter.label == changedOption.label,
    )

    if (isFilterPresent) {
      setActivePinFilters((filter) =>
        filter.filter(
          (existingOption) => existingOption.label !== changedOption.label,
        ),
      )
      return
    }

    setActivePinFilters((activePinFilters) => [
      ...activePinFilters,
      changedOption,
    ])
  }

  const mobileListDisplay = showMobileList ? 'block' : 'none'

  const headerProps = {
    activePinFilters,
    availableFilters: allToggleFilters,
    notification,
    onBlur,
    onFilterChange,
    onLocationChange,
    onPinClick,
    pins,
    selectedPin,
    setShowMobileList,
  }

  return (
    <>
      {/* Desktop list view */}
      <Box
        sx={{
          display: ['none', 'none', 'block', 'block'],
          background: 'white',
          flex: 1,
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        <MapWithListHeader {...headerProps} viewport="desktop" />
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
            zIndex: 2,
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
        <MapWithListHeader {...headerProps} viewport="mobile" />
      </Box>
    </>
  )
}
