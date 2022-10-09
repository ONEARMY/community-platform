import type { DropdownIndicatorProps } from 'react-select'
import { components } from 'react-select'
import { Image } from 'theme-ui'
import ArrowSelectIcon from '../../assets/icons/icon-arrow-select.svg'

// https://github.com/JedWatson/react-select/issues/685#issuecomment-420213835
export const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <Image loading="lazy" src={ArrowSelectIcon} sx={{ width: '12px' }} />
    </components.DropdownIndicator>
  )
}
