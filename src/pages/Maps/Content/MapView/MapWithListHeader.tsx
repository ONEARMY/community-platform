import { useContext, useState } from 'react'
import { LatLngBounds } from 'leaflet'
import { Button, Loader, MapCardList, Modal, OsmGeocoding } from 'oa-components'
import { Flex, Text } from 'theme-ui'

import { MapContext, PROFILE_ZOOM_LEVEL } from '../../MapContext'
import { MapFilterList } from '../../MapFilterList'
import { MemberTypeList } from '../MemberTypeVerticalList/MemberTypeVerticalList.client'

interface IProps {
  viewport: 'desktop' | 'mobile'
}

export const MapWithListHeader = ({ viewport }: IProps) => {
  const mapState = useContext(MapContext)
  const [showFilters, setShowFilters] = useState<boolean>(false)

  const isMobile = viewport === 'mobile'

  const toggleFilterModal = () => setShowFilters(!showFilters)

  if (!mapState) {
    return null
  }

  const hasFiltersSelected =
    !!mapState.activeBadgeFilters.length ||
    !!mapState.activeProfileSettingFilters.length ||
    !!mapState.activeProfileTypeFilters.length ||
    !!mapState.activeTagFilters.length

  if (mapState.loadingMessage) {
    return (
      <Flex
        sx={{
          background: 'background',
          height: '100%',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Loader label={mapState.loadingMessage} sx={{ alignSelf: 'center' }} />
      </Flex>
    )
  }

  return (
    <>
      <Modal
        onDidDismiss={toggleFilterModal}
        isOpen={showFilters}
        sx={{
          width: ['350px', '600px'],
          minWidth: '350px',
          padding: '0 !important',
        }}
      >
        {mapState?.allPins && <MapFilterList onClose={toggleFilterModal} />}
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
            callback={({ boundingbox }) => {
              if (boundingbox) {
                const bounds = new LatLngBounds(
                  [parseFloat(boundingbox[0]), parseFloat(boundingbox[2])],
                  [parseFloat(boundingbox[1]), parseFloat(boundingbox[3])],
                )
                mapState.selectPin(null)
                mapState.fitBounds(bounds)
                mapState.setIsMobile(false)
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

        <MemberTypeList />
      </Flex>
      {mapState && (
        <MapCardList
          columnsCountBreakPoints={isMobile ? { 300: 1, 600: 2 } : undefined}
          list={mapState.filteredPins}
          onPinClick={(pin) => {
            mapState.selectPin(pin)
            mapState.setView({ lat: pin.lat, lng: pin.lng }, PROFILE_ZOOM_LEVEL)
          }}
          selectedPin={mapState.selectedPin}
          viewport={viewport}
        />
      )}
    </>
  )
}
