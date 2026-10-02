import { Guidelines } from './Guidelines';

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useThemeUI } from "@theme-ui/core";

export default {
  title: 'Forms/Guidelines',
  component: Guidelines,
} as Meta<typeof Guidelines>;

export const DefaultComponent = () => {
  const { theme } = useThemeUI() as any;

  return (
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
            style={{color: theme.colors.blue}}
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
};

export const Default: StoryFn<typeof Guidelines> = () => <DefaultComponent />;
