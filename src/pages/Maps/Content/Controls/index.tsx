import * as React from 'react'
import styled from 'styled-components'

import { Button } from 'src/components/Button'
import { LocationSearch } from 'src/components/LocationSearch/LocationSearch'
import { Flex, Box } from 'rebass/styled-components'
import filterIcon from 'src/assets/icons/icon-filters-mobile.png'

import { GroupingFilter } from './GroupingFilter'

import { IPinGrouping, IMapGrouping, IMapPinType } from 'src/models/maps.models'
import { HashLink } from 'react-router-hash-link'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { Map } from 'react-leaflet'
import { ILocation } from 'src/models/common.models'
import { zIndex } from 'src/themes/styled.theme'
import { inject } from 'mobx-react'
import { MapsStore } from 'src/stores/Maps/maps.store'
import Icon from 'src/components/Icons'

interface IProps {
  mapRef: React.RefObject<Map>
  availableFilters: Array<IMapGrouping>
  onFilterChange: (selected: Array<IMapPinType>) => void
  onLocationChange: (selectedLocation: ILocation) => void
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

const MapFlexBar = styled(Flex)`
  max-width: 1280px;
  position: absolute;
  top: 25px;
  width: 100%;
  z-index: ${zIndex.mapFlexBar};
  left: 50%;
  transform: translateX(-50%);
`
@inject('mapsStore')
class Controls extends React.Component<IProps> {
  constructor(props) {
    super(props)
  }
  get injected() {
    return this.props as IInjectedProps
  }

  public render() {
    const { availableFilters } = this.props
    const groupedFilters = availableFilters.reduce(
      (accumulator, current) => {
        const { grouping } = current
        if (accumulator[grouping] === undefined) {
          accumulator[grouping] = []
        }
        accumulator[grouping].push(current)
        return accumulator
      },
      {} as Record<IPinGrouping, Array<IMapGrouping>>,
    )

    return (
      <MapFlexBar
        data-cy="map-controls"
        ml={['0', '0', '0', '50px']}
        py={[0, 1, 1]}
        flexDirection={['column', 'column', 'column', 'row']}
        alignItems={'center'}
        onClick={() => {
          // close any active popup on click
          this.injected.mapsStore.setActivePin(undefined)
        }}
      >
        <Box
          sx={{
            width: ['95%', '308px', '308px'],
            height: '45px',
            m: [0, '5px 0 0 20px'],
          }}
        >
          <LocationSearch
            onChange={(location: ILocation) => {
              this.props.onLocationChange(location)
            }}
            styleVariant="filter"
          />
        </Box>
        <Flex>
          {Object.keys(groupedFilters).map(grouping => (
            <GroupingFilter
              key={grouping}
              entityType={grouping}
              items={groupedFilters[grouping]}
              onChange={selected => {
                this.props.onFilterChange(selected as IMapPinType[])
              }}
            />
          ))}
          <Box
            ml={['0', '50px']}
            mt="5px"
            sx={{ display: ['none', 'none', 'none', 'block'] }}
          >
            <AuthWrapper>
              <HashLink
                smooth
                to={{
                  pathname: `/settings`,
                  hash: '#your-map-pin',
                }}
              >
                <Button variant={'primary'}>My pin</Button>
              </HashLink>
            </AuthWrapper>
          </Box>
        </Flex>
        <Flex width="95%" sx={{ display: ['flex', 'none', 'none'], mt: '5px' }}>
          <Button width="100%" sx={{ display: 'block' }} variant="outline">
            Filters{' '}
            <img
              src={filterIcon}
              style={{ width: '18px', marginLeft: '5px' }}
            />
          </Button>
        </Flex>
      </MapFlexBar>
    )
  }
}

export { Controls }
