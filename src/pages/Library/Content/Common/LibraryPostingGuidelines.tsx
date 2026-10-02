import { useThemeUI } from '@theme-ui/core';
import { Guidelines } from 'oa-components';

export const LibraryPostingGuidelines = () => {
  const { theme } = useThemeUI() as any;

  return (
    <Guidelines
      title="How does it work?"
      steps={[
        <>
          Choose what you want to share{' '}
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
            href="/academy/create/library"
          >
            our guidelines{' '}
            <span role="img" aria-label="nerd-face">
              🤓
            </span>
          </a>
        </>,
        <>
          Prepare your text & images{' '}
          <span role="img" aria-label="archive-box">
            🗄️
          </span>
        </>,
        <>
          Create your Project{' '}
          <span role="img" aria-label="writing-hand">
            ✍️
          </span>
        </>,
        <>
          Click on “Publish”{' '}
          <span role="img" aria-label="mouse">
            🖱️
          </span>
        </>,
        <>We will either send you feedback, or</>,
        <>
          Approve if everything is okay{' '}
          <span role="img" aria-label="tick-validate">
            ✅
          </span>
        </>,
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
