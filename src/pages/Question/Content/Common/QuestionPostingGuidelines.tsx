import { Guidelines } from 'oa-components';
import { useContext } from 'react';
import { TenantContext } from 'src/pages/common/TenantContext';

export const QuestionPostingGuidelines = () => {
  const tenantContext = useContext(TenantContext);
  const guidelinesUrl = tenantContext?.questionsGuidelines;

  const steps = [
    ...(guidelinesUrl
      ? [
          <>
            Have a look at our{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-info hover:underline"
              href={guidelinesUrl}
            >
              question guidelines.
            </a>
          </>,
        ]
      : []),
    <>
      Write your question (in English){' '}
      <span role="img" aria-label="raised-hand">
        🙌
      </span>
    </>,
    <>
      Double check if it's already made and{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="text-info hover:underline"
        href="/questions"
      >
        search{' '}
      </a>
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
