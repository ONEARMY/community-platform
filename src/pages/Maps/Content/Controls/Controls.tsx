import React, { useState } from 'react'
import { Link, useNavigate } from '@remix-run/react'
import { Button, Modal, OsmGeocoding } from 'oa-components'
import filterIcon from 'src/assets/icons/icon-filters-mobile.png'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { Box, Flex } from 'theme-ui'

import { GroupingFilterDesktop } from './GroupingFilterDesktop'
import { GroupingFilterMobile } from './GroupingFilterMobile'

import type { FilterGroup } from './transformAvailableFiltersToGroups'

interface IProps {
  availableFilters: FilterGroup[]
  onLocationChange: (latlng: { lat: number; lng: number }) => void
  onFilterChange: (filters: string[]) => void
}
interface IState {
  showFiltersMobile: boolean
  filtersSelected: Array<string>
}

export const Controls = ({
  availableFilters,
  onLocationChange,
  onFilterChange,
}: IProps) => {
  const navigate = useNavigate()
  const { userStore } = useCommonStores().stores
  const [state, setState] = useState<IState>({
    showFiltersMobile: false,
    filtersSelected: [],
  })

  const toggleFilterMobileModal = () => {
    setState((state) => ({
      ...state,
      showFiltersMobile: !state.showFiltersMobile,
    }))
  }

  const onChange = (selected) => {
    onFilterChange && onFilterChange(selected)
    setState((state) => ({ ...state, filtersSelected: selected }))
  }

  const myPinUrl = userStore!.user
    ? {
        pathname: `/settings`,
        hash: '#your-map-pin',
      }
    : { pathname: '/sign-up' }

  return (
    <Flex
      data-cy="map-controls"
      sx={{
        flexDirection: ['column', 'column', 'row', 'row'],
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'absolute',
        top: '60px',
        zIndex: 2000,
        transform: 'translateX("-50%")',
      }}
      onClick={() => navigate('/map')}
    >
      <Box
        sx={{
          width: ['95%', '95%', '308px'],
          height: '45px',
        }}
      >
        <OsmGeocoding
          callback={(data) => {
            logger.debug(data, 'Map.Content.Controls.ReactOsmGeocoding')
            if (data.lat && data.lon) {
              onLocationChange({
                lat: data.lat,
                lng: data.lon,
              })
            }
          }}
          countrycodes=""
          acceptLanguage="en"
        />
      </Box>
      <Flex>
        <GroupingFilterDesktop
          availableFilters={availableFilters}
          onChange={(selected) => onChange(selected)}
        />
        <Box
          ml={['0', '50px']}
          mt="5px"
          sx={{ display: ['none', 'none', 'none', 'block'] }}
        >
          <Link
            to={myPinUrl}
            // the map underneath also redirects, so prevent it from doing so
            onClick={(e) => e.stopPropagation()}
          >
            <Button type="button" variant="primary">
              My pin
            </Button>
          </Link>
        </Box>
      </Flex>
      <Box sx={{ display: ['flex', 'flex', 'none'], mt: '5px', width: '95%' }}>
        <Button
          type="button"
          sx={{ display: 'block', width: '100%' }}
          variant="secondary"
          onClick={toggleFilterMobileModal}
        >
          Filters
          {state.filtersSelected.length > 0 && (
            <span> ({state.filtersSelected.length})</span>
          )}
          <img
            src={filterIcon}
            alt="icon"
            style={{ width: '18px', marginLeft: '5px' }}
          />
        </Button>
      </Box>
      <Modal
        onDidDismiss={toggleFilterMobileModal}
        isOpen={state.showFiltersMobile}
      >
        <GroupingFilterMobile
          availableFilters={availableFilters}
          selectedItems={state.filtersSelected}
          onChange={(selected) => onChange(selected)}
          onClose={toggleFilterMobileModal}
        />
      </Modal>
    </Flex>
  )
}
