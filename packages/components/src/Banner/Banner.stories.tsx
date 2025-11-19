import { Banner } from './Banner';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Layout/Banner',
  component: Banner,
} as Meta<typeof Banner>;

export const Default: StoryFn<typeof Banner> = () => (
  <Banner>Defaults to a failure banner when no varient defined</Banner>
);

export const AccentWithOnclick: StoryFn<typeof Banner> = () => (
  <Banner variant="accent" onClick={() => null}>
    This is an accent with onClick
  </Banner>
);

export const InfoWithCustomStylings: StoryFn<typeof Banner> = () => (
  <Banner variant="info" sx={{ height: '200px', border: '4px solid #333' }}>
    Info with custom stylings
  </Banner>
);

export const Success: StoryFn<typeof Banner> = () => (
  <Banner variant="success" onClick={() => null}>
    Success Banner
  </Banner>
);
