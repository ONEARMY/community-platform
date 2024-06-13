import { useTheme } from '@emotion/react'
import { ExternalLink, Guidelines } from 'oa-components'

export const QuestionPostingGuidelines = () => {
  const theme = useTheme()

  const steps = [
    <>
      Write your question (in English){' '}
      <span role="img" aria-label="raised-hand">
        🙌
      </span>
    </>,
    <>
      Double check if it's already made and{' '}
      <ExternalLink sx={{ color: 'blue' }} href="/questions">
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
  ]

  if (theme.questionsGuidelinesURL) {
    steps.unshift(
      <>
        Have a look at our{' '}
        <ExternalLink
          sx={{ color: 'blue' }}
          href={theme.questionsGuidelinesURL}
        >
          question guidelines.
        </ExternalLink>
      </>,
    )
  }

  return <Guidelines title="How does it work?" steps={steps} />
}
