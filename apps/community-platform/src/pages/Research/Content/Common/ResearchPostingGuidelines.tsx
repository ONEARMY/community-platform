import { ExternalLink, Guidelines } from '@onearmy.apps/components'

export const ResearchPostingGuidelines = () => (
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
        <ExternalLink sx={{ color: 'blue' }} href="/academy/guides/research">
          our guidelines{' '}
          <span role="img" aria-label="nerd-face">
            🤓
          </span>
        </ExternalLink>
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
)
