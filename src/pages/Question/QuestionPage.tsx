import { useState, useEffect } from 'react'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { Box, Heading } from 'theme-ui'

export const QuestionPage = () => {
  const store = useQuestionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      const question: any = await store.fetchQuestionBySlug()
      setQuestion(question || null)
      setIsLoading(false)
    }
    fetchQuestions()
  }, [isLoading])

  return (
    <Box sx={{ p: 7 }}>
      {question ? <Heading>{question.title}</Heading> : null}
    </Box>
  )
}
