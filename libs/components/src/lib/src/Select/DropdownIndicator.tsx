import { components } from 'react-select'
import { Image } from 'theme-ui'

import IconArrowDown from '../../assets/icons/icon-arrow-down.svg'

import type { DropdownIndicatorProps } from 'react-select'

// https://github.com/JedWatson/react-select/issues/685#issuecomment-420213835
export const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <Image loading="lazy" src={IconArrowDown} sx={{ width: '12px' }} />
    </components.DropdownIndicator>
  )
}
