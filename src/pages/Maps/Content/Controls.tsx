import * as React from 'react'
import styled from 'styled-components'

import { Button } from 'src/components/Button'
import { LocationSearch } from 'src/components/LocationSearch/LocationSearch'
import { FlexContainer } from 'src/components/Layout/FlexContainer'
import { IPinType } from 'src/models/maps.models'

interface IProps {
  availableFilters: Array<IPinType>
  setFilters: (filters: Array<IPinType>) => void
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
    return (
      <FlexContainer
        style={{
          width: '80%',
          position: 'absolute',
          left: '10%',
          borderRadius: '5px',
          zIndex: 99999,
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
        <FlexSpacer />
        <Button variant="outline">My Pin</Button>
      </FlexContainer>
    )
  }
}

export { Controls }
