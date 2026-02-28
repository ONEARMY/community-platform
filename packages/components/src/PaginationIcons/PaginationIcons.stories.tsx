import { PaginationIcons } from './PaginationIcons';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/PaginationIcons',
  component: PaginationIcons,
} as Meta<typeof PaginationIcons>;

export const ChevronLeft: StoryFn<typeof PaginationIcons> = () => (
  <PaginationIcons
    hidden={false}
    title="Previous"
    directionIcon="chevron-left"
    onClick={() => console.log('Previous clicked')}
  />
);

export const ChevronRight: StoryFn<typeof PaginationIcons> = () => (
  <PaginationIcons
    hidden={false}
    title="Next"
    directionIcon="chevron-right"
    onClick={() => console.log('Next clicked')}
  />
);

export const DoubleArrowLeft: StoryFn<typeof PaginationIcons> = () => (
  <PaginationIcons
    hidden={false}
    title="First"
    directionIcon="double-arrow-left"
    onClick={() => console.log('First page clicked')}
  />
);

export const DoubleArrowRight: StoryFn<typeof PaginationIcons> = () => (
  <PaginationIcons
    hidden={false}
    title="Last"
    directionIcon="double-arrow-right"
    onClick={() => console.log('Last page clicked')}
  />
);

