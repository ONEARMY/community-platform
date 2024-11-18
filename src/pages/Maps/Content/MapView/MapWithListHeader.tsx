import { useState } from 'react'
import {
  Button,
  CardList,
  MapFilterList,
  MemberTypeVerticalList,
  Modal,
  OsmGeocoding,
} from 'oa-components'
import { Flex, Text } from 'theme-ui'

import type {
  ILatLng,
  IMapPin,
  MapFilterOption,
  MapFilterOptionsList,
} from 'oa-shared'

interface IProps {
  pins: IMapPin[]

  activePinFilters: MapFilterOptionsList
  availableFilters: MapFilterOptionsList
  onBlur: () => void
  onPinClick: (pin: IMapPin) => void
  onFilterChange: (filter: MapFilterOption) => void
  onLocationChange: (latlng: ILatLng) => void
  selectedPin: IMapPin | undefined
  setShowMobileList?: (set: boolean) => void
  viewport: 'desktop' | 'mobile'
}

export const MapWithListHeader = (props: IProps) => {
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const {
    pins,
    activePinFilters,
    availableFilters,
    onBlur,
    onFilterChange,
    onLocationChange,
    onPinClick,
    selectedPin,
    setShowMobileList,
    viewport,
  } = props
  const isMobile = viewport === 'mobile'

  const toggleFilterModal = () => setShowFilters(!showFilters)
  const hasFiltersSelected = activePinFilters.length !== 0

  const sx = {
    width: ['350px', '600px'],
    minWidth: '350px',
    padding: '0 !important',
  }

  return (
    <>
      <Modal onDidDismiss={toggleFilterModal} isOpen={showFilters} sx={sx}>
        <MapFilterList
          activeFilters={activePinFilters}
          availableFilters={availableFilters}
          onClose={toggleFilterModal}
          onFilterChange={onFilterChange}
          pinCount={pins.length}
        />
      </Modal>

      <Flex
        sx={{
          flexDirection: 'column',
          backgroundColor: 'background',
          gap: 2,
          paddingY: 2,
          paddingTop: isMobile ? '50px' : 6,
        }}
      >
        <Flex sx={{ paddingX: 4, gap: 2, flexDirection: 'row' }}>
          <OsmGeocoding
            callback={({ lat, lon }) => {
              if (lat && lon) {
                onLocationChange({ lat, lng: lon })
                onBlur()
                setShowMobileList && setShowMobileList(false)
              }
            }}
            countrycodes=""
            acceptLanguage="en"
            placeholder="Search for a place"
          />
          <Button
            data-cy="MapFilterList-OpenButton"
            icon="sliders"
            onClick={toggleFilterModal}
            variant={hasFiltersSelected ? 'primary' : 'outline'}
          >
            <Text sx={{ paddingRight: 2 }}>Filter</Text>
          </Button>
        </Flex>

        <MemberTypeVerticalList
          activeFilters={activePinFilters}
          availableFilters={availableFilters}
          onFilterChange={onFilterChange}
        />
      </Flex>
      <CardList
        columnsCountBreakPoints={isMobile ? { 300: 1, 600: 2 } : undefined}
        list={pins}
        onBlur={onBlur}
        onPinClick={onPinClick}
        selectedPin={selectedPin}
        viewport={viewport}
      />
    </>
  )
}
