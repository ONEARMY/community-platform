import * as React from 'react'
import styled from 'styled-components'

import { Button } from 'src/components/Button'
import { LocationSearch } from 'src/components/LocationSearch/LocationSearch'
import { FlexContainer } from 'src/components/Layout/FlexContainer'

import { GroupingFilter } from './GroupingFilter'

import { IPinType, EntityType } from 'src/models/maps.models'
import { HashLink } from 'react-router-hash-link'

interface IProps {
  availableFilters: Array<IPinType>
  onFilterChange: (grouping: EntityType, filters: Array<IPinType>) => void
  onLocationChange: (selectedLocation) => void
}

const SearchWrapper = styled.div`
  width: 300px;
  height: 45px;
`

const FlexSpacer = styled.div`
  flex: 1;
`

class Controls extends React.Component<IProps> {
  constructor(props) {
    super(props)
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
      {} as Record<EntityType, Array<IPinType>>,
    )

    return (
      <FlexContainer
        style={{
          width: '80%',
          position: 'absolute',
          left: '10%',
          borderRadius: '5px',
          zIndex: 2,
          marginTop: '30px',
        }}
      >
        <SearchWrapper>
          <LocationSearch
            onChange={location => {
              this.props.onLocationChange(location)
            }}
          />
        </SearchWrapper>
        {Object.keys(groupedFilters).map(grouping => (
          <GroupingFilter
            key={grouping}
            entityType={grouping}
            items={groupedFilters[grouping]}
            onChange={options =>
              this.props.onFilterChange(grouping as EntityType, options)
            }
          />
        ))}
        <FlexSpacer />
        <HashLink
          smooth
          to={{
            pathname: `/settings`,
            hash: '#your-map-pin',
          }}
        >
          <Button variant="outline">My Pin</Button>
        </HashLink>
      </FlexContainer>
    )
  }
}

export { Controls }
