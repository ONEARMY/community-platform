import { useId } from 'react';
import { Tooltip } from 'react-tooltip';
import type { IconProps } from '../Icon/Icon';
import { Icon } from '../Icon/Icon';

export interface IProps extends IconProps {
  tooltip: string;
}

export const InformationTooltip = (props: IProps) => {
  const id = useId();

  return (
    <>
      <Icon {...props} data-tooltip-id={id} />

      <Tooltip id={id}>
        <p
          dangerouslySetInnerHTML={{ __html: props.tooltip }}
          style={{ textAlign: 'center', margin: 0 }}
        />
      </Tooltip>
    </>
  );
};
