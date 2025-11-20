import { useId } from 'react';
import { Text } from 'theme-ui';

import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import type { availableGlyphs } from '../Icon/types';

export interface IconCountWithTooltipProps {
  count: number;
  dataCy?: string;
  icon: availableGlyphs;
  text: string;
}

function shortFormatNumber(num: number): string {
  const units = [
    { value: 1000000, suffix: 'M' },
    { value: 1000, suffix: 'K' },
  ];

  for (const { value, suffix } of units) {
    if (num >= value) {
      return (num / value).toFixed(1).replace(/\.0$/, '') + suffix;
    }
  }

  return num.toString();
}

export const IconCountWithTooltip = (props: IconCountWithTooltipProps) => {
  const { count, dataCy, icon, text } = props;
  const id = useId();
  const countText = shortFormatNumber(count);

  return (
    <>
      <Text
        data-cy={dataCy}
        data-tooltip-id={id}
        data-tooltip-content={text}
        color="black"
        sx={{
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          fontSize: [1, 2, 2],
        }}
      >
        {countText}
        <Icon glyph={icon} ml={1} />
      </Text>
      <Tooltip id={id} />
    </>
  );
};
