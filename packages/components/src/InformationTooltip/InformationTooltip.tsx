import { Tooltip } from 'react-tooltip'

import { Icon } from '../Icon/Icon'

import type { IconProps } from '../Icon/Icon'

export interface IProps extends IconProps {
  tooltip: string
}

export const InformationTooltip = (props: IProps) => {
  const id = Math.random().toString()

  return (
    <>
      <Icon
        {...props}
        data-tooltip-id={id}
        data-tooltip-content={props.tooltip}
      />

      <Tooltip id={id} />
    </>
  )
}
