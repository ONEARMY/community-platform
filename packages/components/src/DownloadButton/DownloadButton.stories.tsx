import { DownloadButton } from './DownloadButton';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/DownloadButton',
  component: DownloadButton,
} as Meta<typeof DownloadButton>;

export const Default: StoryFn<typeof DownloadButton> = () => <DownloadButton onClick={() => {}} />;

export const CustomDetails: StoryFn<typeof DownloadButton> = () => (
  <DownloadButton onClick={() => {}} glyph="download-cloud" label="Hello there" />
);
