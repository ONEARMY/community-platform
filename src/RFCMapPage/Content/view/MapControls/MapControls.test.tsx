import { render, fireEvent } from '@testing-library/react'
import { IMapControlsProps } from '../../../types'
import MapControls from './MapControls'

import { getRandomTestsPins } from '../../library/testHelpers'
import { groupPins, getFilters } from '../../library/utils'

describe.only('MapControls', () => {
  it('should render', async () => {
    // Arrange
    const mapPinsGrouped = groupPins(getRandomTestsPins(3))
    const testData = getFilters(mapPinsGrouped)
    const mockOnChange = jest.fn()
    const testProps: IMapControlsProps = {
      filters: testData,
      onChange: mockOnChange
    }
    const filtersNames = Object.keys(testData)

    // Act
    const { getByText } = render(<MapControls {...testProps} />);

    // Assert
    const element = getByText(`${testData[filtersNames[filtersNames.length - 1]].displayName} (${testData[filtersNames[filtersNames.length - 1]]._count})`)
    expect(element).toContainHTML('checked=""')

    // Change state
    fireEvent.click(element)
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChange).toHaveBeenCalledWith({ name: testData[filtersNames[filtersNames.length - 1]].name, active: false })

    // Change state again  
    fireEvent.click(element)
    expect(mockOnChange).toHaveBeenCalledTimes(2)
    expect(mockOnChange).toHaveBeenCalledWith({ name: testData[filtersNames[filtersNames.length - 1]].name, active: true })
  })
  
})
