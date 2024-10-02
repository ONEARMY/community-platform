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
  onFilterChange: (filter: MapFilterOption) => void
  onLocationChange: (latlng: ILatLng) => void
  pins: IMapPin[]
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
    pins,
    setShowMobileList,
    viewport,
  } = props
  const isMobile = viewport === 'mobile'

  const toggleFilterModal = () => setShowFilters(!showFilters)
  const hasFiltersSelected = activePinFilters.length !== 0

  return (
    <>
      <Modal onDidDismiss={toggleFilterModal} isOpen={showFilters}>
        <MapFilterList
          activeFilters={activePinFilters}
          availableFilters={availableFilters}
          onClose={toggleFilterModal}
          onFilterChange={onFilterChange}
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
            showIconOnly={isMobile ? true : false}
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
        dataCy={viewport}
        list={pins}
        filteredList={filteredPins}
      />
    </>
  )
}
