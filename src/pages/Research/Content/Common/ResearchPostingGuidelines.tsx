import { useThemeUI } from '@theme-ui/core';
import { Guidelines } from 'oa-components';

export const ResearchPostingGuidelines = () => {
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
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.colors.blue }}
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
        <>
          Come back when you made progress{' '}
          <span role="img" aria-label="writing-hand">
            ✍️
          </span>
        </>,
        <>Keep doing this</>,
        <>
          Be proud{' '}
          <span role="img" aria-label="simple-smile">
            🙂
          </span>
        </>,
      ]}
    />
  );
};
