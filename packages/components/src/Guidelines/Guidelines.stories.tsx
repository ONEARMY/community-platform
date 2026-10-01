import { Guidelines } from './Guidelines';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Forms/Guidelines',
  component: Guidelines,
} as Meta<typeof Guidelines>;

export const DefaultComponent = () => (
  <Guidelines
    title="How does it work?"
    steps={[
      <>
        Choose a topic you want to research{' '}
        <span role="img" aria-label="raised-hand">
          🙌
        </span>
      </>,
      <>
        Read{' '}
        <a
          rel="noopener noreferrer"
          target="_blank"
          style={{ color: 'blue' }}
          href="/academy/guides/research"
        >
          our guidelines{' '}
          <span role="img" aria-label="nerd-face">
            🤓
          </span>
        </a>
      </>,
      <>
        Write your introduction{' '}
        <span role="img" aria-label="archive-box">
          🗄️
        </span>
      </>,
    ]}
  />
);

export const Default: StoryFn<typeof Guidelines> = () => <DefaultComponent />;
