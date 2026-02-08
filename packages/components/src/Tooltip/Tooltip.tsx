import styled from '@emotion/styled';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const StyledTooltip = styled(ReactTooltip)`
  z-index: 9999 !important;
  text-align: center;
  border-radius: 5px !important;
  padding: 5px 10px !important;
`;

type TooltipProps = {
  id: string;
  children?: React.ReactNode;
};

export const Tooltip = ({ children, id }: TooltipProps) => {
  return (
    <StyledTooltip id={id} openEvents={{ mouseenter: true, focus: true }} closeEvents={{ mouseleave: true, blur: true }}>
      {children}
    </StyledTooltip>
  );
};
