import { InternalLink } from './InternalLink';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/InternalLink',
  component: InternalLink,
} as Meta<typeof InternalLink>;

export const Default: StoryFn<typeof InternalLink> = () => (
  <InternalLink to={`/abc/`}>Link</InternalLink>
);
