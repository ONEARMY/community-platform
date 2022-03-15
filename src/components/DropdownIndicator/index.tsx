import { components } from 'react-select'
import { Image } from 'rebass'
import ArrowSelectIcon from '../../assets/icons/icon-arrow-select.svg'

// https://github.com/JedWatson/react-select/issues/685#issuecomment-420213835
export const DropdownIndicator = props =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <Image src={ArrowSelectIcon} sx={{ width: '12px' }} />
    </components.DropdownIndicator>
  )
