import { Loader } from 'oa-components'
import { useState, useEffect } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { IQuestion } from 'src/models'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { Box, Card, Heading, Text } from 'theme-ui'

type IProps = RouteComponentProps<{ slug: string }>

export const QuestionPage = (props: IProps) => {
  const store = useQuestionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState<IQuestion.Item | null>(null)

  useEffect(() => {
    const { slug } = props.match.params
    const fetchQuestions = async () => {
      const question: any = await store.fetchQuestionBySlug(slug)
      setQuestion(question || null)
      setIsLoading(false)
    }
    fetchQuestions()
  }, [isLoading])

  return (
    <Box sx={{ p: 7 }}>
      {isLoading ? (
        <Loader />
      ) : question ? (
        <Card sx={{ mt: 4, p: 4 }}>
          <Heading mb={1}>{question.title}</Heading>
          <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
            {question.description}
          </Text>
        </Card>
      ) : null}
    </Box>
  )
}
