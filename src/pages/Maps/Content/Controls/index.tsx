import * as React from 'react'
import styled from 'styled-components'

import { Button } from 'src/components/Button'
import { LocationSearch } from 'src/components/LocationSearch/LocationSearch'
import { Flex } from 'rebass'

import { GroupingFilter } from './GroupingFilter'

import { IPinType, IPinGrouping } from 'src/models/maps.models'
import { HashLink } from 'react-router-hash-link'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { Map } from 'react-leaflet'
import { ILocation } from 'src/models/common.models'
import { zIndex } from 'src/themes/styled.theme'
import { inject } from 'mobx-react'
import { MapsStore } from 'src/stores/Maps/maps.store'

interface IProps {
  mapRef: React.RefObject<Map>
  availableFilters: Array<IPinType>
  onFilterChange: (grouping: IPinGrouping, filters: Array<IPinType>) => void
  onLocationChange: (selectedLocation: ILocation) => void
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

const SearchWrapper = styled.div`
  width: 300px;
  height: 45px;
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
      {} as Record<IPinGrouping, Array<IPinType>>,
    )

    return (
      <MapFlexBar
        data-cy="map-controls"
        ml="50px"
        py={1}
        onClick={() => {
          // close any active popup on click
          this.injected.mapsStore.setActivePin(undefined)
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
            onChange={options => {
              this.props.onFilterChange(grouping as IPinGrouping, options)
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
            <Button variant={'primary'}>My pin</Button>
          </HashLink>
        </AuthWrapper>
      </MapFlexBar>
    )
  }
}

export { Controls }
