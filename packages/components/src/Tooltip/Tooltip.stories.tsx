import { Button } from 'theme-ui';

import { Tooltip } from './Tooltip';

// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryFn } from '@storybook/react';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
} as Meta<typeof Tooltip>;

export const Hover: StoryFn<typeof Tooltip> = () => (
  <>
    <Button data-tooltip-id="tooltip" data-tooltip-content="This is a tooltip">
      Hover over me
    </Button>
    <Tooltip id="tooltip" />
  </>
);
