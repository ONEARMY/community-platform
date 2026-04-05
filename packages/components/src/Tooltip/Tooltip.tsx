import styled from '@emotion/styled';
import { type CSSProperties } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const StyledTooltip = styled(ReactTooltip)`
  z-index: 9999 !important;
  text-align: center;
  border-radius: 5px !important;
  padding: 5px 10px !important;
`;

export type TooltipProps = {
  id: string;
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  noArrow?: boolean;
  place?: 'top' | 'right' | 'bottom' | 'left';
  offset?: number;
  positionStrategy?: 'absolute' | 'fixed';
};

export const Tooltip = ({
  children,
  id,
  className,
  style,
  noArrow,
  place,
  offset,
  positionStrategy,
}: TooltipProps) => {
  return (
    <StyledTooltip
      id={id}
      className={className}
      style={style}
      noArrow={noArrow}
      place={place}
      offset={offset}
      positionStrategy={positionStrategy}
      openEvents={{ mouseenter: true, focus: true }}
      closeEvents={{ mouseleave: true, blur: true }}
    >
      {children}
    </StyledTooltip>
  );
};
