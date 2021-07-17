import { IFieldProps } from './Fields'
import { LocationSearch } from '../LocationSearch/LocationSearch'

interface IExtendedFieldProps extends IFieldProps {
  // add additional onChange style method to respond more directly to value changes
  // without need for react-final-form listener
  customChange?: (location) => void
}

export const LocationSearchField = ({
  input,
  customChange,
  ...rest
}: IExtendedFieldProps) => (
  <LocationSearch
    {...rest}
    {...input}
    onChange={location => {
      // as validation happens on blur also want to artificially trigger when values change
      // (no native blur event)
      input.onChange(location)
      if (customChange) {
        customChange(location)
      }
      input.onBlur()
    }}
    placeholder="Search for a location"
  />
)
