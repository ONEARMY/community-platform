import * as React from 'react'
import styled from 'styled-components'

import { Button } from 'src/components/Button'
import { LocationSearch } from 'src/components/LocationSearch/LocationSearch'
import { Flex } from 'rebass'

import { GroupingFilter } from './GroupingFilter'

import { IPinGrouping, IMapGrouping, IMapPinType } from 'src/models/maps.models'
import { HashLink } from 'react-router-hash-link'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { Map } from 'react-leaflet'
import { ILocation } from 'src/models/common.models'
import { zIndex } from 'src/themes/styled.theme'
import { inject } from 'mobx-react'
import { MapsStore } from 'src/stores/Maps/maps.store'
import { RouteComponentProps } from 'react-router'

interface IProps extends RouteComponentProps<any> {
  mapRef: React.RefObject<Map>
  availableFilters: Array<IMapGrouping>
  onFilterChange: (selected: Array<IMapPinType>) => void
  onLocationChange: (selectedLocation: ILocation) => void
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

const SearchWrapper = styled.div`
  width: 308px;
  height: 45px;
  margin: 5px 0 0 20px;
`

const MapFlexBar = styled(Flex)`
  max-width: 1280px;
  position: absolute;
  top: 25px;
  width: 100%;
  z-index: ${zIndex.mapFlexBar};
  left: 50%;
  transform: translateX(-50%);
`

const FlexSpacer = styled.div`
  flex: 1;
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
        ml={['0', '50px', '50px']}
        py={[0, 1, 1]}
        flexDirection={['column-reverse', 'column-reverse', 'row']}
        alignItems={['center', 'stretch', 'stretch']}
        onClick={() => {
          // close any active popup on click
          this.injected.mapsStore.setActivePin(undefined)
          this.props.history.push('/map')
        }}
      >
        <SearchWrapper>
          <LocationSearch
            onChange={(location: ILocation) => {
              this.props.onLocationChange(location)
            }}
            styleVariant="filter"
          />
        </SearchWrapper>
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
        <FlexSpacer />
        <AuthWrapper>
          <HashLink
            smooth
            to={{
              pathname: `/settings`,
              hash: '#your-map-pin',
            }}
          >
            <Button
              sx={{ display: ['none', 'block', 'block'] }}
              variant={'primary'}
            >
              My pin
            </Button>
          </HashLink>
        </AuthWrapper>
      </MapFlexBar>
    )
  }
}

export { Controls }
