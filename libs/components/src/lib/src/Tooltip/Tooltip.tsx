import ReactTooltip from 'react-tooltip'
import styled from '@emotion/styled'

const StyledTooltip = styled(ReactTooltip)`
  opacity: 1 !important;
  z-index: 9999 !important;
  line-height: 1.5rem;
`

type TooltipProps = {
  children?: React.ReactNode
}

export const Tooltip = ({ children, ...props }: TooltipProps) => {
  return (
    <StyledTooltip
      event="mouseenter focus"
      eventOff="mouseleave blur"
      effect="solid"
      {...props}
    >
      {children}
    </StyledTooltip>
  )
}
