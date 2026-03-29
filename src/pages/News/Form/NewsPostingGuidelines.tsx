import { ExternalLink, Guidelines } from 'oa-components';

export const NewsPostingGuidelines = () => {
  const steps = [
    <>
      Write your news (in English){' '}
      <span role="img" aria-label="raised-hand">
        🙌
      </span>
    </>,
    <>
      Double check if it's already made and{' '}
      <ExternalLink sx={{ color: 'blue' }} href="/news">
        search{' '}
      </ExternalLink>
    </>,
    <>
      Provide enough info for people to help{' '}
      <span role="img" aria-label="archive-box">
        🗄️
      </span>
    </>,
    <>
      Add a category and search so others can find it{' '}
      <span role="img" aria-label="writing-hand">
        ✍️
      </span>
    </>,
    <>Come back to comment the answers</>,
    <>
      Get your best answer{' '}
      <span role="img" aria-label="simple-smile">
        🙂
      </span>
    </>,
  ];

  return <Guidelines title="How does it work?" steps={steps} />;
};
