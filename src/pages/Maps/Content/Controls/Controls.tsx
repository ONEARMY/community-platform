import * as React from 'react'
import styled from '@emotion/styled'

import { Button, Modal, OsmGeocoding } from 'oa-components'
import { Flex, Box } from 'theme-ui'
import filterIcon from 'src/assets/icons/icon-filters-mobile.png'

import { GroupingFilterDesktop } from './GroupingFilterDesktop'
import { GroupingFilterMobile } from './GroupingFilterMobile'

import type { IMapPinType } from 'src/models/maps.models'
import { HashLink as Link } from 'react-router-hash-link'
import type { Map } from 'react-leaflet'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import { inject } from 'mobx-react'
import type { MapsStore } from 'src/stores/Maps/maps.store'
import type { UserStore } from 'src/stores/User/user.store'
import type { RouteComponentProps } from 'react-router'
import { logger } from 'src/logger'
import type { FilterGroup } from './transformAvailableFiltersToGroups'

interface IProps extends RouteComponentProps<any> {
  mapRef: React.RefObject<Map>
  availableFilters: FilterGroup[]
  onFilterChange: (selected: Array<IMapPinType>) => void
  onLocationChange: (latlng: { lat: number; lng: number }) => void
}
interface IState {
  showFiltersMobile: boolean
  filtersSelected: Array<string>
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
  userStore?: UserStore
}

const MapFlexBar = styled(Flex)`
  max-width: 1280px;
  position: absolute;
  top: 25px;
  width: 100%;
  z-index: ${theme.zIndex.mapFlexBar};
  left: 50%;
  transform: translateX(-50%);
`
@inject('mapsStore', 'userStore')
class Controls extends React.Component<IProps, IState> {
  toggleFilterMobileModal = () => {
    this.setState({ showFiltersMobile: !this.state.showFiltersMobile })
  }
  constructor(props: IProps) {
    super(props)
    this.state = {
      showFiltersMobile: false,
      filtersSelected: [],
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }

  public render() {
    const { availableFilters } = this.props
    const { showFiltersMobile, filtersSelected } = this.state
    const groupedFilters = availableFilters

    return (
      <MapFlexBar
        data-cy="map-controls"
        ml={['0', '0', '0', '50px']}
        py={[0, 1, 0]}
        sx={{
          flexDirection: ['column', 'column', 'column', 'row'],
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => {
          // close any active popup on click
          this.injected.mapsStore.setActivePin(undefined)
          this.props.history.push('/map')
        }}
      >
        <Box
          sx={{
            width: ['95%', '95%', '308px'],
            height: '45px',
            m: [0, 0, '5px 0 0 20px'],
          }}
        >
          <OsmGeocoding
            callback={(data) => {
              logger.debug(data, 'Map.Content.Controls.ReactOsmGeocoding')
              if (data.lat && data.lon) {
                this.props.onLocationChange({
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
            items={groupedFilters}
            selectedItems={filtersSelected}
            onChange={(selected) => {
              this.props.onFilterChange(selected as IMapPinType[])
              this.setState({ filtersSelected: selected })
            }}
          />
          <Box
            ml={['0', '50px']}
            mt="5px"
            sx={{ display: ['none', 'none', 'none', 'block'] }}
          >
            <Link
              to={
                this.injected.userStore!.user
                  ? {
                      pathname: `/settings`,
                      hash: '#your-map-pin',
                    }
                  : { pathname: '/sign-up' }
              }
              // the map underneath also redirects, so prevent it from doing so
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant={'primary'}>My pin</Button>
            </Link>
          </Box>
        </Flex>
        <Box
          sx={{ display: ['flex', 'flex', 'none'], mt: '5px', width: '95%' }}
        >
          <Button
            sx={{ display: 'block', width: '100%' }}
            variant="secondary"
            onClick={this.toggleFilterMobileModal}
          >
            Filters
            {filtersSelected.length > 0 && (
              <span> ({filtersSelected.length})</span>
            )}
            <img
              src={filterIcon}
              alt="icon"
              style={{ width: '18px', marginLeft: '5px' }}
            />
          </Button>
        </Box>
        <Modal
          onDidDismiss={this.toggleFilterMobileModal}
          isOpen={showFiltersMobile}
        >
          <GroupingFilterMobile
            items={groupedFilters}
            selectedItems={filtersSelected}
            onChange={(selected) => {
              this.props.onFilterChange(selected as IMapPinType[])
              this.setState({ filtersSelected: selected })
            }}
            onClose={this.toggleFilterMobileModal}
          />
        </Modal>
      </MapFlexBar>
    )
  }
}

export { Controls }
