import { render, fireEvent } from '@testing-library/react'
import { ICheckboxProps } from '../../../types';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('should render', async () => {    
    // Arrange
    const mockOnChange = jest.fn()
    const testProps:ICheckboxProps = {
      name: 'test',
      label: 'Test label',
      checked: true,
      onChange: mockOnChange
    }

    // Act
    const { getByText } = render(<Checkbox {...testProps} />);

    // Assert
    const element = getByText(testProps.label) 
    expect(element).toContainHTML('checked=""')

    // Change state
    fireEvent.click(element)
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChange).toHaveBeenCalledWith({name: testProps.name, active: !testProps.checked})
  })
})
