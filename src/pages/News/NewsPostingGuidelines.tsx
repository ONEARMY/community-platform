import { Guidelines } from 'oa-components';

export const NewsPostingGuidelines = () => {
  const steps = [
    <>
      Write your news (in English){' '}
      <span role="img" aria-label="writing-hand">
        ✍️
      </span>
    </>,
    <>
      Add images and links{' '}
      <span role="img" aria-label="picture">
        🖼️
      </span>
    </>,
    <>Provide enough info for people to help</>,
    <>
      Select category and visibility so the right people get notified{' '}
      <span role="img" aria-label="bell">
        🔔
      </span>
    </>,
    <>
      Come back to reply to comments{' '}
      <span role="img" aria-label="comments">
        💬
      </span>
    </>,
  ];

  return <Guidelines title="How does it work?" steps={steps} />;
};
