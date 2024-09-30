import { CardList, FilterList, OsmGeocoding } from 'oa-components'
import { Box, Flex, Heading } from 'theme-ui'

import type { ILatLng, IMapPin } from 'oa-shared'

interface IProps {
  activePinFilters: string[]
  availableFilters: any
  filteredPins: IMapPin[] | null
  onBlur: () => void
  onFilterChange: (label: string) => void
  onLocationChange: (latlng: ILatLng) => void
  pins: IMapPin[]
  setShowMobileList?: (set: boolean) => void
  viewport: 'desktop' | 'mobile'
}

export const MapWithListHeader = (props: IProps) => {
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

  return (
    <>
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

        <Box sx={{ paddingX: 4 }}>
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
        </Box>

        <FilterList
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
