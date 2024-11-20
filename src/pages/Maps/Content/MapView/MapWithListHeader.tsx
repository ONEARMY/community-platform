import { useState } from 'react'
import {
  Button,
  CardList,
  MapFilterList,
  MapFilterProfileTypeCardList,
  Modal,
  OsmGeocoding,
} from 'oa-components'
import { Flex, Heading, Text } from 'theme-ui'

import type {
  ILatLng,
  IMapPin,
  MapFilterOption,
  MapFilterOptionsList,
} from 'oa-shared'

interface IProps {
  activePinFilters: MapFilterOptionsList
  availableFilters: MapFilterOptionsList
  filteredPins: IMapPin[] | null
  onBlur: () => void
  onPinClick: (pin: IMapPin) => void
  onFilterChange: (filter: MapFilterOption) => void
  onLocationChange: (latlng: ILatLng) => void
  pins: IMapPin[]
  selectedPin: IMapPin | undefined
  setShowMobileList?: (set: boolean) => void
  viewport: 'desktop' | 'mobile'
}

export const MapWithListHeader = (props: IProps) => {
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const {
    activePinFilters,
    availableFilters,
    filteredPins,
    onBlur,
    onFilterChange,
    onLocationChange,
    onPinClick,
    pins,
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
  }

  return (
    <>
      <Modal onDidDismiss={toggleFilterModal} isOpen={showFilters} sx={sx}>
        <MapFilterList
          activeFilters={activePinFilters}
          availableFilters={availableFilters}
          onClose={toggleFilterModal}
          onFilterChange={onFilterChange}
          pinCount={filteredPins?.length || 0}
        />
      </Modal>

      <Flex
        sx={{
          flexDirection: 'column',
          backgroundColor: 'background',
          gap: 2,
          paddingY: 2,
          paddingTop: isMobile ? '50px' : 2,
        }}
      >
        <Heading
          data-cy="welome-header"
          sx={{
            paddingX: 4,
          }}
          variant={isMobile ? 'small' : 'heading'}
        >
          Welcome to our world!{' '}
          {pins && `${pins.length} members (and counting...)`}
        </Heading>

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

        <MapFilterProfileTypeCardList
          activeFilters={activePinFilters}
          availableFilters={availableFilters}
          onFilterChange={onFilterChange}
        />
      </Flex>
      <CardList
        columnsCountBreakPoints={isMobile ? { 300: 1, 600: 2 } : undefined}
        list={pins}
        filteredList={filteredPins}
        onBlur={onBlur}
        onPinClick={onPinClick}
        selectedPin={selectedPin}
        viewport={viewport}
      />
    </>
  )
}
