import { useContext, useEffect, useRef } from 'react'
import { Button, Map } from 'oa-components'
import { Box, Flex } from 'theme-ui'

import { MapContext } from '../../MapContext'
import { ButtonZoomIn } from './ButtonZoomIn.client'
import { Clusters } from './Cluster.client'
import { Popup } from './Popup.client'

import type { LatLngExpression } from 'leaflet'
import type { Map as MapType } from 'react-leaflet'

export const MapView = () => {
  const mapState = useContext(MapContext)
  const mapRef = useRef<MapType>(null)
  const clusterGroupRef = useRef<any>(null)

  useEffect(() => {
    if (mapRef.current && mapState) {
      mapState.setMapRef(mapRef.current)
    }
  }, [mapRef.current, mapState])

  useEffect(() => {
    if (clusterGroupRef.current && mapState) {
      mapState.setClusterGroupRef(clusterGroupRef.current)
    }
  }, [clusterGroupRef.current, mapState])

  if (!mapState) {
    return null
  }

  const handleLocationChange = () => {
    if (mapRef.current) {
      mapState.setBoundaries(mapRef.current.leafletElement.getBounds())
    }
  }

  const isViewportGreaterThanTablet = window.innerWidth > 1024
  const mapCenter: LatLngExpression = mapState.location
    ? [mapState.location.lat, mapState.location.lng]
    : [0, 0]

  return (
    <Map
      ref={mapRef}
      className="markercluster-map"
      center={mapCenter}
      zoom={mapState.zoom}
      setZoom={mapState.setZoom}
      maxZoom={18}
      style={{ flex: 1, backgroundColor: '#AAD3DF' }}
      zoomControl={isViewportGreaterThanTablet}
      onclick={() => mapState.selectPin(null)}
      ondragend={handleLocationChange}
      onzoomend={handleLocationChange}
      onresize={isViewportGreaterThanTablet ? handleLocationChange : undefined}
      useFlyTo
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: 4,
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <ButtonZoomIn
          setCenter={(value) => mapState.setLocation(value)}
          setZoom={mapState.setZoom}
        />
      </Box>

      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          padding: 2,
          gap: 2,
        }}
      >
        <Button
          data-cy="ShowMobileListButton"
          icon="step"
          sx={{ display: ['flex', 'flex', 'none'], zIndex: 1000 }}
          onClick={() => mapState.setIsMobile(true)}
          small
        >
          Show list view
        </Button>
      </Flex>
      {mapState.filteredPins && (
        <Clusters
          pins={mapState.filteredPins}
          onPinClick={mapState.selectPinWithClusterCheck}
          onClusterClick={(cluster) => {
            mapState.fitBounds(cluster.getBounds())
          }}
          clusterGroupRef={clusterGroupRef}
        />
      )}
      {mapState.selectedPin && (
        <Popup
          activePin={mapState.selectedPin}
          mapRef={mapRef}
          onClose={() => mapState.selectPin(null)}
        />
      )}
    </Map>
  )
}
