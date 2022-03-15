import * as React from 'react';
import ReactTooltip from 'react-tooltip'
import styled from '@emotion/styled'

const StyledTooltip = styled(ReactTooltip)`
  opacity: 1 !important;
  z-index: 9999 !important;
`

const Tooltip: React.FC = props => {
  return (
    <StyledTooltip
      event="mouseenter focus"
      eventOff="mouseleave blur"
      effect="solid"
      {...props}
    />
  )
}

export default Tooltip
