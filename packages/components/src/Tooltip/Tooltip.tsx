import { Tooltip as ReactTooltip } from 'react-tooltip'
import styled from '@emotion/styled'

const StyledTooltip = styled(ReactTooltip)`
  opacity: 1 !important;
  z-index: 9999 !important;
  line-height: 1.5rem;
  text-align: center;
`

type TooltipProps = {
  id: string
  children?: React.ReactNode
}

export const Tooltip = ({ children, id }: TooltipProps) => {
  return (
    <StyledTooltip
      id={id}
      openEvents={{ mouseenter: true, focus: true }}
      closeEvents={{ mouseleave: true, blur: true }}
    >
      {children}
    </StyledTooltip>
  )
}
