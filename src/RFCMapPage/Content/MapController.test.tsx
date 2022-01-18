import { render, fireEvent } from '@testing-library/react'

import { IMapControllerProps } from '../types'
import { getFilters, groupPins } from './library/utils'
import { getFixedTestsPins } from './library/testHelpers'
import MockLeafletMap from './view/LeafletMap/MockLeafletMap';

import MapController from './MapController'

describe('MapController', () => {
  let MockDatabaseProvider: any;

  beforeEach(() => {
    MockDatabaseProvider = ({mapPins, handleClickOnPin}: IMapControllerProps) => (
      <MapController mapPins={mapPins} handleClickOnPin={handleClickOnPin} >
        <MockLeafletMap zoom={4} center={[0,0]} style={{height: "100vh"}} iconUrlBase='assets/icons/' />
      </MapController>
    )
  })

  it('should render', async () => {    
    // Arrange
    const testsData = getFixedTestsPins()
    const filters = getFilters(groupPins(testsData))
    const filtersNames = Object.keys(filters)

    // Act
    const { queryByText, getByText } = render(<MockDatabaseProvider mapPins={testsData} />);

    // Assert
    // Pins
    expect(queryByText(new RegExp(testsData[0]._id))).toBeInTheDocument()
    expect(queryByText(new RegExp(testsData[1]._id))).toBeInTheDocument()

    // Filters
    expect(filtersNames.length).toBe(2)
    const element0 = getByText(`${filters[filtersNames[0]].displayName} (1)`)
    expect(element0).toContainHTML('checked=""')
    const element1 = getByText(`${filters[filtersNames[1]].displayName} (1)`)
    expect(element1).toContainHTML('checked=""')

    // Change state to unchecked
    fireEvent.click(element0)
    fireEvent.click(element1)

    // Assert
    expect(queryByText(new RegExp(testsData[0]._id))).not.toBeInTheDocument()
    expect(queryByText(new RegExp(testsData[1]._id))).not.toBeInTheDocument()

    // Change state to checked
    fireEvent.click(element0)
    fireEvent.click(element1)

    // Assert
    expect(queryByText(new RegExp(testsData[0]._id))).toBeInTheDocument()
    expect(queryByText(new RegExp(testsData[1]._id))).toBeInTheDocument()
  })

  it('mapPins prop changes should refresh the map', async () => {    
    // Arrange
    const testsData = getFixedTestsPins()
  
    const { rerender, queryByText } = render(<MockDatabaseProvider mapPins={testsData} />);

    expect(queryByText(new RegExp(testsData[0]._id))).toBeInTheDocument()
    expect(queryByText(new RegExp(testsData[1]._id))).toBeInTheDocument()

    // Act: change props 
    const newData = [ testsData[1] ]
    rerender(<MockDatabaseProvider mapPins={newData} />);
    
    // Assert
    expect(queryByText(new RegExp(testsData[1]._id))).toBeInTheDocument()
    expect(queryByText(new RegExp(testsData[1].type))).toBeInTheDocument()
    expect(queryByText(new RegExp(testsData[0]._id))).not.toBeInTheDocument()
    expect(queryByText(new RegExp(testsData[0].type))).not.toBeInTheDocument()
  })  

  it('should return a pin id on click', async () => {    
    // Arrange
    const testsData = getFixedTestsPins()
    const mockOnClick = jest.fn()

    const { getByText } = render(<MockDatabaseProvider mapPins={testsData} handleClickOnPin={mockOnClick} />);

    const element = getByText(new RegExp(testsData[0]._id))

    // Act: click on pin 
    fireEvent.click(element)

    // Assert
    expect(mockOnClick).toHaveBeenCalledTimes(1)
    expect(mockOnClick).toHaveBeenCalledWith(testsData[0]._id)
  })  

})